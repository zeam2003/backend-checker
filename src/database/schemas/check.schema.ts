import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CheckDetail } from './check-detail.schema';

@Schema({ timestamps: true })
export class Check extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop()
  ticketId: number;

  @Prop({ type: [{ type: Object }] }) // O más específico si usás subdocumentos
  details: CheckDetail[];
}

export const CheckSchema = SchemaFactory.createForClass(Check);
