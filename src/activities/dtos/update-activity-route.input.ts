import { InputType, Field, Int } from '@nestjs/graphql';
import { CreateActivityRouteInput } from './create-activity-route.input';

@InputType()
export class UpdateActivityRouteInput extends CreateActivityRouteInput {
  @Field()
  id: string;
}
