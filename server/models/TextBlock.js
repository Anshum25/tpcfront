import mongoose from "mongoose";

const TextBlockSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    value: { type: String, required: true },
});

const TextBlock = mongoose.model("TextBlock", TextBlockSchema);
export default TextBlock;
