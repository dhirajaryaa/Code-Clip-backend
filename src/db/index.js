import mongoose from "mongoose";
export const connectDB = async()=>{
    try {
        // database connection 
      mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);        
    } catch (error) {
       console.error("MongoDB Connection Error=> "+error);
        process.exit(1);
    }
}