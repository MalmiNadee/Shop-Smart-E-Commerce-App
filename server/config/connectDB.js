import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()

if(!process.env.MONGODB_URI){
   throw new Error(
       "Please provide MONGODB_URI in the .env file" 
   )
}

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("connected DB")
    } catch (error) {
        console.log("Mongodb connect error", error)
        process.exit(1) //stop the server
    }
}

export default connectDB;

////pw o2tPHbzBpRiOw05P
//un it22341204