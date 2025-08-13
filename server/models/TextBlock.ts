import mongoose, { Schema, Document } from 'mongoose';

export interface ITextBlock extends Document {
  title: string;
  value: string;
}

const TextBlockSchema = new Schema<ITextBlock>({
  title: { type: String, required: true, unique: true },
  value: { type: String, required: true },
});

export default mongoose.model<ITextBlock>('TextBlock', TextBlockSchema); 