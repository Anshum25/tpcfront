import mongoose from "mongoose";
import TextBlock from "../models/TextBlock.js";
import Image from "../models/Image.js";

const MONGO_URI =
  "mongodb+srv://anshum25052006:bvM2EHVP7hrA21GM@tpc.z8zgugo.mongodb.net/tpcDB?retryWrites=true&w=majority&appName=TPC"; // <-- Replace with your actual MongoDB URI

const textBlocks = [
  { title: "Homepage Stat 1 Number", value: "10K+" },
  { title: "Homepage Stat 1 Label", value: "Students" },
  { title: "Homepage Stat 2 Number", value: "50+" },
  { title: "Homepage Stat 2 Label", value: "Events" },
  { title: "Homepage Stat 3 Number", value: "14+" },
  { title: "Homepage Stat 3 Label", value: "Distinguished Advisors" },
  { title: "Homepage Stat 4 Number", value: "6+" },
  { title: "Homepage Stat 4 Label", value: "Partner Institutions" },
  { title: "Achievement 1 Title", value: "Gujarat's Largest" },
  { title: "Achievement 1 Subtitle", value: "Student-Run Society" },
  { title: "Achievement 2 Title", value: "10+ Years" },
  { title: "Achievement 2 Subtitle", value: "of Excellence" },
  { title: "Achievement 3 Title", value: "Recognized by" },
  { title: "Achievement 3 Subtitle", value: "Top Institutions" },
  { title: "Footer Stat 1 Number", value: "10,000+" },
  { title: "Footer Stat 1 Label", value: "Active Students" },
  { title: "Footer Stat 2 Number", value: "50+" },
  { title: "Footer Stat 2 Label", value: "Annual Events" },
  { title: "Footer Stat 3 Number", value: "14+" },
  { title: "Footer Stat 3 Label", value: "Distinguished Advisors" },
  { title: "Footer Stat 4 Number", value: "6+" },
  { title: "Footer Stat 4 Label", value: "Partner Institutions" },
  { title: "Join Team Button", value: "Join Our Team" },
  { title: "Contact Team Button", value: "Contact Us" },
  { title: "Join Community Button", value: "Join Our Community" },
  { title: "Explore Events Button", value: "Explore Events" },
  { title: "Our Supporters Button", value: "Our Supporters" },
  // ...add any other text blocks you want to seed...
];

const images = [
  // ...add your image seed data here if needed...
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    for (const block of textBlocks) {
      await TextBlock.findOneAndUpdate(
        { title: block.title },
        { value: block.value },
        { upsert: true, new: true },
      );
      console.log(`Upserted text block: ${block.title}`);
    }
    for (const img of images) {
      await Image.findOneAndUpdate(
        { title: img.title },
        { url: img.url, alt: img.alt },
        { upsert: true, new: true },
      );
      console.log(`Upserted image: ${img.title}`);
    }
    await mongoose.disconnect();
    console.log("Done!");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
