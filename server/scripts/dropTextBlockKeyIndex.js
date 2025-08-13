const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://myuser:Anshum%40255@tpc.z8zgugo.mongodb.net/tpcDB?retryWrites=true&w=majority&appName=TPC";

async function dropKeyIndex() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    const result = await mongoose.connection.db
      .collection("textblocks")
      .dropIndex("key_1");
    console.log("Dropped index:", result);
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    if (err.codeName === "IndexNotFound") {
      console.log("Index key_1 not found, nothing to drop.");
    } else {
      console.error("Error dropping index:", err);
    }
    await mongoose.disconnect();
  }
}

dropKeyIndex();
