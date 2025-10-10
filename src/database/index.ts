import mongoose from "mongoose";
import "dotenv/config"

export const connectDB = async():Promise<void>=>{
    const mongo_uri = process.env.MONGO_URI as string
    await mongoose.connect(mongo_uri)
}