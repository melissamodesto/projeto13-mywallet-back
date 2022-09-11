import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

try {
  await client.connect();
  console.log("Connected to database");
} catch (error) {
  console.log(error.message);
}

const db = client.db("test");

export default db;
