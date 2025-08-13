import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  title: { type: String, required: true },
    url: { type: String, required: true },
  alt: { type: String },
  part: { type: String, required: true },
  event: { type: String },
  date: { type: String },
  location: { type: String },
  category: { type: String },
});

const Image = mongoose.model("Image", ImageSchema);
export default Image;
