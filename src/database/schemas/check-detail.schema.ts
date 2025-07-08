import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CheckDetail extends Document {
  @Prop({ required: true })
  question: string;

  @Prop()
  answer: string;

  @Prop()
  observation?: string;
}

export const CheckDetailSchema = SchemaFactory.createForClass(CheckDetail);
