import { Injectable } from '@nestjs/common';
import { Route } from '../entities/route.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Sector } from '../entities/sector.entity';
import {
  Connection,
  MoreThanOrEqual,
  Not,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { CreateRouteInput } from '../dtos/create-route.input';
import { UpdateRouteInput } from '../dtos/update-route.input';
import slugify from 'slugify';
import { DifficultyVote } from '../entities/difficulty-vote.entity';
import { User } from '../../users/entities/user.entity';
import { FindRoutesServiceInput } from '../dtos/find-routes-service.input';
import { BaseService } from './base.service';
import { tickAscentTypes } from '../../activities/entities/activity-route.entity';
import { Transaction } from '../../core/utils/transaction.class';

@Injectable()
export class RoutesService extends BaseService {
  constructor(
    @InjectRepository(Route)
    private routesRepository: Repository<Route>,
    @InjectRepository(Sector)
    private sectorsRepository: Repository<Sector>,
    @InjectRepository(DifficultyVote)
    private difficultyVoteRepository: Repository<DifficultyVote>,
    private connection: Connection,
  ) {
    super();
  }

  async find(input: FindRoutesServiceInput): Promise<Route[]> {
    return this.buildQuery(input).getMany();
  }

  async findOne(input: FindRoutesServiceInput): Promise<Route> {
    return this.buildQuery(input).getOneOrFail();
  }

  async findByIds(ids: string[]): Promise<Route[]> {
    return this.routesRepository.findByIds(ids);
  }

  async findOneById(id: string): Promise<Route> {
    return this.routesRepository.findOneOrFail(id);
  }

  async findOneBySlug(
    cragSlug: string,
    routeSlug: string,
    user: User,
  ): Promise<Route> {
    const builder = this.routesRepository.createQueryBuilder('r');

    builder
      .innerJoin('crag', 'c', 'c.id = r."cragId"')
      .where('r.slug = :routeSlug', { routeSlug: routeSlug })
      .andWhere('c.slug = :cragSlug', { cragSlug: cragSlug });
    // TODO ADD PUBLISH STATUS CONDITION !!

    if (!(user != null)) {
      builder.andWhere('c.isHidden = false');
    }

    return builder.getOneOrFail();
  }

  countManyTicks(keys: readonly string[]) {
    const builder = this.routesRepository
      .createQueryBuilder('r')
      .leftJoin('r.activityRoutes', 'ar', 'ar.ascentType in (:...aTypes)', {
        aTypes: [...tickAscentTypes],
      })
      .select('r.id')
      .addSelect('COUNT(ar.id)', 'nrTicks')
      .where('r.id IN (:...rIds)', { rIds: keys })
      .groupBy('r.id');

    return builder.getRawMany();
  }

  countManyTries(keys: readonly string[]) {
    const builder = this.routesRepository
      .createQueryBuilder('r')
      .leftJoin('r.activityRoutes', 'ar')
      .select('r.id')
      .addSelect('COUNT(ar.id)', 'nrTries')
      .where('r.id IN (:...rIds)', { rIds: keys })
      .groupBy('r.id');

    return builder.getRawMany();
  }

  countManyDisctinctClimbers(keys: readonly string[]) {
    const builder = this.routesRepository
      .createQueryBuilder('r')
      .leftJoin('r.activityRoutes', 'ar')
      .select('r.id')
      .addSelect('COUNT(DISTINCT(ar."userId")) as "nrClimbers"')
      .where('r.id IN (:...rIds)', { rIds: keys })
      .groupBy('r.id');

    return builder.getRawMany();
  }

  async create(data: CreateRouteInput, user: User): Promise<Route> {
    const route = new Route();

    this.routesRepository.merge(route, data);

    route.user = Promise.resolve(user);

    const sector = await this.sectorsRepository.findOneOrFail(data.sectorId);

    route.sector = Promise.resolve(sector);
    route.cragId = sector.cragId;

    route.slug = await this.generateRouteSlug(route.name, route.cragId);

    if (data.baseDifficulty == null || route.isProject) {
      return this.routesRepository.save(route);
    }

    await this.routesRepository.save(route);

    if (data.baseDifficulty != null && !route.isProject) {
      await this.createBaseGrade(route, data.baseDifficulty);
    }

    return Promise.resolve(route);
  }

  async update(data: UpdateRouteInput): Promise<Route> {
    const route = await this.routesRepository.findOneOrFail(data.id);

    this.routesRepository.merge(route, data);

    if (data.name != null) {
      route.slug = await this.generateRouteSlug(
        route.name,
        route.cragId,
        route.id,
      );
    }

    const transaction = new Transaction(this.connection);
    await transaction.start();

    try {
      await transaction.save(route);

      // find following positions and shift if necessary
      const followingRoutes = await this.routesRepository.find({
        where: {
          sectorId: route.sectorId,
          position: MoreThanOrEqual(route.position),
          id: Not(route.id),
        },
        order: {
          position: 'ASC',
        },
      });

      if (
        followingRoutes.length > 0 &&
        followingRoutes[0].position == route.position
      ) {
        for (const followingRoute of followingRoutes) {
          followingRoute.position++;
          await transaction.save(followingRoute);
        }
      }
    } catch (e) {
      await transaction.rollback();
      throw e;
    }

    await transaction.commit();

    return Promise.resolve(route);
  }

  async delete(id: string): Promise<boolean> {
    const route = await this.routesRepository.findOneOrFail(id);

    return this.routesRepository.remove(route).then(() => true);
  }

  private createBaseGrade(
    route: Route,
    difficulty: number,
  ): Promise<DifficultyVote> {
    const vote = new DifficultyVote();
    vote.route = Promise.resolve(route);
    vote.difficulty = difficulty;
    vote.isBase = true;

    return this.difficultyVoteRepository.save(vote);
  }

  private buildQuery(
    params: FindRoutesServiceInput = {},
  ): SelectQueryBuilder<Route> {
    const builder = this.routesRepository.createQueryBuilder('s');

    builder.orderBy('s.position', 'ASC');

    if (params.sectorId != null) {
      builder.andWhere('s.sector = :sectorId', {
        sectorId: params.sectorId,
      });
    }

    if (params.id != null) {
      builder.andWhere('s.id = :id', {
        id: params.id,
      });
    }

    this.setPublishStatusParams(builder, 's', params);

    return builder;
  }

  private async generateRouteSlug(
    routeName: string,
    cragId: string,
    selfId?: string,
  ) {
    const selfCond = selfId != null ? { id: Not(selfId) } : {};
    let slug = slugify(routeName, { lower: true });
    let suffixCounter = 0;
    let suffix = '';
    while (
      (await this.routesRepository.findOne({
        where: { ...selfCond, slug: slug + suffix, crag: cragId },
      })) !== undefined
    ) {
      suffixCounter++;
      suffix = '-' + suffixCounter;
    }
    slug += suffix;
    return slug;
  }
}
