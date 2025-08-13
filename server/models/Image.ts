import mongoose, { Schema, Document } from 'mongoose';

export interface IImage extends Document {
  title: string;
  url: string;
  alt: string;
}

const ImageSchema = new Schema<IImage>({
  title: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  alt: { type: String, required: true },
});

export default mongoose.model<IImage>('Image', ImageSchema); 