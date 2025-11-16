import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class SearchInput {
  @Field()
  searchString: string;

  @Field({ nullable: true })
  @IsOptional()
  cragId?: string;
}
