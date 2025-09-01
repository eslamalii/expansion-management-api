import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DocumentDocument = HydratedDocument<ResearchDocument>;
@Schema({ timestamps: true })
export class ResearchDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, index: 'text' })
  content: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ required: true, default: Date.now })
  projectId: number;
}

export const DocumentSchema = SchemaFactory.createForClass(ResearchDocument);
