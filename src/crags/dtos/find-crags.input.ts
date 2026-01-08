import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, MinLength } from 'class-validator';
import { CragType } from '../entities/crag.entity';

@InputType()
export class FindCragsInput {
  @Field({ nullable: true })
  @IsOptional()
  country?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  countrySlugs?: string[];

  @Field({ nullable: true })
  @IsOptional()
  type?: CragType;

  @Field({ nullable: true })
  @IsOptional()
  peakId?: string;

  @Field({ nullable: true })
  @IsOptional()
  area?: string;

  @Field({ nullable: true })
  @IsOptional()
  areaSlug?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  areasSlugs?: string[];

  @Field({ nullable: true })
  @IsOptional()
  showPrivate?: boolean;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  routeTypeId?: string[];

  @Field({ nullable: true })
  @IsOptional()
  id?: string;

  @Field({ nullable: true })
  @IsOptional()
  slug?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  orientations?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  seasons?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  wallAngles?: string[];

  @Field({ nullable: true })
  @IsOptional()
  minGrade?: number;

  @Field({ nullable: true })
  @IsOptional()
  maxGrade?: number;

  @Field({ nullable: true })
  @IsOptional()
  minApproachTime?: number;

  @Field({ nullable: true })
  @IsOptional()
  maxApproachTime?: number;

  @Field({ nullable: true })
  // minimum length 3 to avoid too generic names
  @MinLength(3)
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  rainproof?: boolean;

  // deprecated (ignored), frontend should handle this if necessary on crag list
  @Field({ nullable: true })
  @IsOptional()
  allowEmpty?: boolean;
}
