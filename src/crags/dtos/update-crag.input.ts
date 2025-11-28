import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CragType, Orientation, Season, WallAngle } from '../entities/crag.entity';
import { PublishStatus } from '../entities/enums/publish-status.enum';

@InputType()
export class UpdateCragInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  type: CragType;

  @Field({ nullable: true })
  @IsOptional()
  publishStatus: PublishStatus;

  @Field({ nullable: true })
  @IsOptional()
  cascadePublishStatus: boolean;

  @Field({ nullable: true })
  @IsOptional()
  isHidden: boolean;

  @Field({ nullable: true })
  @IsOptional()
  lat: number;

  @Field({ nullable: true })
  @IsOptional()
  lon: number;

  @Field({ nullable: true })
  @IsOptional()
  countryId: string;

  @Field({ nullable: true })
  @IsOptional()
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

  @Field(() => [WallAngle], { nullable: true })
  @IsOptional()
  wallAngles?: WallAngle[];

  @Field({ nullable: true })
  @IsOptional()
  defaultGradingSystemId: string;

  @Field({ nullable: true })
  @IsOptional()
  rejectionMessage: string;

  @Field({ nullable: true })
  @IsOptional()
  rainproof?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  approachTime?: number;

  @Field({ nullable: true })
  @IsOptional()
  parking_lat?: number;

  @Field({ nullable: true })
  @IsOptional()
  parking_lon?: number;
}
