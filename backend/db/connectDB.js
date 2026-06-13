import mongoose from "mongoose" 

export const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected to mongoDB")
    }
    catch(error){
        console.error("error connecting to mongoDB:", error.message)
        process.exit(1)      //1 : erreur , 0:success
    }
}