import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class FindCountriesBySlugInput {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  countries?: string[];
}
