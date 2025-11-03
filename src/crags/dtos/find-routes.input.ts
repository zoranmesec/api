import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class FindRoutesInput {
  @Field({ nullable: true })
  @IsOptional()
  starRating?: number;

  @Field({ nullable: true })
  @IsOptional()
  minGrade?: number;

  @Field({ nullable: true })
  @IsOptional()
  maxGrade?: number;
}
