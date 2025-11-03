import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CommentType } from '../entities/comment.entity';

@InputType()
export class UpdateCommentInput {
  @Field()
  id: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  @IsOptional()
  exposedUntil: Date;

  @Field()
  type: CommentType;
}
