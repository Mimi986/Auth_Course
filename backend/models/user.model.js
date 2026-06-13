import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true 
    },
    lastLogin:{
        type:Date,
        default:Date.now()    //date d'aujourd'hui 
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    resetPasswordToken:String,   //token créé lors du reset password
    resetPasswordExpiresAt:Date,   
    verificationToken:String, //le code à 6 chiffres
    verificationTokenExpiresAt:Date
},{timestamps:true})    //timestamps ajoute : createdAt et updatedAt

export default mongoose.model("User",userSchema)