import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class FindRoutesTouchesInput {
  @Field(() => [String])
  routeIds: string[];

  @Field(() => Date)
  before: Date;

  @Field({ nullable: true })
  @IsOptional()
  activityId?: string;

  constructor(routeIds: string[], before: Date, activityId?: string) {
    this.routeIds = routeIds;
    this.before = before;
    this.activityId = activityId;
  }
}
