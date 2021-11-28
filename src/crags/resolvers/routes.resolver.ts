import {
  Resolver,
  Mutation,
  Args,
  Query,
  ResolveField,
  Parent,
  ResolveProperty,
  Context,
} from '@nestjs/graphql';
import { Route } from '../entities/route.entity';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UseInterceptors, UseFilters } from '@nestjs/common';
import { AuditInterceptor } from '../../audit/interceptors/audit.interceptor';
import { NotFoundFilter } from '../filters/not-found.filter';
import { CreateRouteInput } from '../dtos/create-route.input';
import { UpdateRouteInput } from '../dtos/update-route.input';
import { RoutesService } from '../services/routes.service';
import { CommentsService } from '../services/comments.service';
import { Comment, CommentType } from '../entities/comment.entity';
import { Grade } from '../entities/grade.entity';
import { GradesService } from '../services/grades.service';
import { IGraphQLContext } from 'src/types/graphql.types';
import { Pitch } from '../entities/pitch.entity';
import { PitchesService } from '../services/pitches.service';

@Resolver(() => Route)
export class RoutesResolver {
  constructor(
    private routesService: RoutesService,
    private commentsService: CommentsService,
    private pitchesService: PitchesService,
    private gradesService: GradesService,
  ) {}

  @Mutation(() => Route)
  @Roles('admin')
  @UseInterceptors(AuditInterceptor)
  @UseFilters(NotFoundFilter)
  async createRoute(
    @Args('input', { type: () => CreateRouteInput }) input: CreateRouteInput,
  ): Promise<Route> {
    return this.routesService.create(input);
  }

  @Mutation(() => Route)
  @Roles('admin')
  @UseInterceptors(AuditInterceptor)
  @UseFilters(NotFoundFilter)
  async updateRoute(
    @Args('input', { type: () => UpdateRouteInput }) input: UpdateRouteInput,
  ): Promise<Route> {
    return this.routesService.update(input);
  }

  @Mutation(() => Boolean)
  @Roles('admin')
  @UseInterceptors(AuditInterceptor)
  @UseFilters(NotFoundFilter)
  async deleteRoute(@Args('id') id: string): Promise<boolean> {
    return this.routesService.delete(id);
  }

  @Query(() => Route)
  @UseFilters(NotFoundFilter)
  async route(@Args('id') id: string): Promise<Route> {
    return this.routesService.findOneById(id);
  }

  @ResolveField('warnings', () => [Comment])
  async getWarnings(
    @Parent() route: Route,
    @Context() { routeWarningsLoader }: IGraphQLContext,
  ): Promise<Comment[]> {
    return routeWarningsLoader.load(route.id);
  }

  @ResolveField('conditions', () => [Comment])
  async getConditions(
    @Parent() route: Route,
    @Context() { routeConditionsLoader }: IGraphQLContext,
  ): Promise<Comment[]> {
    return routeConditionsLoader.load(route.id);
  }

  @ResolveField('comments', () => [Comment])
  async getComments(
    @Parent() route: Route,
    @Context() { routeCommentsLoader }: IGraphQLContext,
  ): Promise<Comment[]> {
    return routeCommentsLoader.load(route.id);
  }

  @ResolveField('grades', () => [Grade])
  async grades(@Parent() route: Route): Promise<Grade[]> {
    return this.gradesService.findByRouteId(route.id);
  }

  @ResolveField('pitches', () => [Pitch])
  async pitches (@Parent() route: Route): Promise<Pitch[]> {
    return this.pitchesService.findByRouteId(route.id);
  }
}
