import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { FindManyOptions, In, Repository, MoreThanOrEqual } from 'typeorm';
import { CreateCommentInput } from '../dtos/create-comment.input';
import { FindCommentsInput } from '../dtos/find-comments.input';
import { UpdateCommentInput } from '../dtos/update-comment';
import { Comment } from '../entities/comment.entity';
import { Crag } from '../entities/crag.entity';
import { IceFall } from '../entities/ice-fall.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Crag)
    private cragRepository: Repository<Crag>,
    @InjectRepository(IceFall)
    private iceFallRepository: Repository<IceFall>,
  ) {}

  async findOneById(id: string): Promise<Comment> {
    return this.commentsRepository.findOneOrFail(id);
  }

  async create(data: CreateCommentInput, user: User): Promise<Comment> {
    const comment = new Comment();

    this.commentsRepository.merge(comment, data);

    comment.user = Promise.resolve(user);

    if (data.cragId != null) {
      comment.crag = Promise.resolve(
        await this.cragRepository.findOneOrFail(data.cragId),
      );
    }

    if (data.iceFallId != null) {
      comment.iceFall = Promise.resolve(
        await this.iceFallRepository.findOneOrFail(data.iceFallId),
      );
    }

    return this.commentsRepository.save(comment);
  }

  async update(data: UpdateCommentInput): Promise<Comment> {
    const comment = await this.commentsRepository.findOneOrFail(data.id);

    this.commentsRepository.merge(comment, data);

    return this.commentsRepository.save(comment);
  }

  async delete(id: string): Promise<boolean> {
    const comment = await this.commentsRepository.findOneOrFail(id);

    return this.commentsRepository.remove(comment).then(() => true);
  }

  find(params: FindCommentsInput = {}): Promise<Comment[]> {
    const options: FindManyOptions = {
      order: {},
      where: {},
    };

    if (params.routeId != null) {
      options.where['route'] = params.routeId;
    }

    if (params.routeIds != null) {
      options.where['routeId'] = In(params.routeIds);
    }

    if (params.cragId != null) {
      options.where['crag'] = params.cragId;
    }

    if (params.type != null) {
      options.where['type'] = params.type;
    }

    options.order = { created: 'DESC' };

    return this.commentsRepository.find(options);
  }

  /**
   * Gets comments of type warning that should be exposed
   *
   * @returns Comment[]
   */
  getExposedWarnings() {
    return this.commentsRepository.find({
      where: {
        type: 'warning',
        exposedUntil: MoreThanOrEqual('2021-12-03'),
      },
      order: { updated: 'DESC' },
    });
  }
}
