import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import {
  CragType,
  Orientation,
  Season,
  WallAngle,
} from '../entities/crag.entity';
import { PublishStatus } from '../entities/enums/publish-status.enum';

@InputType()
export class CreateCragInput {
  @Field()
  name: string;

  @Field()
  type: CragType;

  @Field()
  publishStatus: PublishStatus;

  @Field()
  isHidden: boolean;

  @Field({ nullable: true })
  @IsOptional()
  lat: number;

  @Field({ nullable: true })
  @IsOptional()
  lon: number;

  @Field()
  countryId: string;

  @Field({ nullable: true })
  areaId: string;

  @Field({ nullable: true })
  @IsOptional()
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  access: string;

  @Field(() => [Orientation], { nullable: true })
  @IsOptional()
  orientations?: Orientation[];

  @Field(() => [Season], { nullable: true })
  @IsOptional()
  seasons?: Season[];

  @Field()
  defaultGradingSystemId: string;

  @Field(() => [WallAngle], { nullable: true })
  @IsOptional()
  wallAngles?: WallAngle[];

  @Field({ nullable: true })
  @IsOptional()
  rainproof?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  approachTime?: number;

  @Field({ nullable: true })
  @IsOptional()
  parkingLat: number;

  @Field({ nullable: true })
  @IsOptional()
  parkingLon: number;
}
