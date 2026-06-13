import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"
import { sendVerificationEmail,welcomeEmail,sendPasswordResetEmail,sendResetSuccessEmail } from "../nodemailer/email.js"
import crypto from "crypto"

export const signup = async (req,res) => {
    const {email,password,name} = req.body 
    try{
        if(!email || !password || !name) throw new Error("All fields are required")
        const userAlreadyExists = await User.findOne({email}) 
        if(userAlreadyExists) return res.status(400).json({success:false,message:"user already exists"})

        const hashedPassword = await bcryptjs.hash(password,10)   //hashage du mdp
        const verificationToken = Math.floor(100000+Math.random()*900000).toString()   //+10000 s'assurer que le code est à 6 chiffres exactement 
        const user = new User ({
            email,
            password:hashedPassword,   //redéfinition
            name,
            verificationToken,
            verificationTokenExpiresAt:Date.now()+24*60*60*1000
        })
        await user.save()
        generateTokenAndSetCookie(res,user._id)    //création du token pour le user
        await sendVerificationEmail(user.email,verificationToken)
        res.status(201).json({success:true,message:"user created successfully",user:{...user._doc,password:undefined}})    //récup la documentation du user 
    }catch(error){
        return res.status(400).json({success:false,message:error.message})
    }
}

export const login = async (req,res) => {
    
    const {email,password} = req.body
    try{
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({success:false,message:"invalid credentials"})
            const isPasswordValid = await bcrypt.compare(password,user.password)
            if(!isPasswordValid) return res.status(400).json({success:false,message:"invalid credentials"})
                generateTokenAndSetCookie(res,user._id)
                user.lastLogin = new Date()
                await user.save()
                res.status(200).json({success:true,message:"logged in successfully",user:{...user._doc,password:undefined}})
    }catch(error){
        console.log("error in login",error.message)
        res.status(400).json({success:false,message:error.message})
    }
}

export const logout = async (req,res) => {
    res.clearCookie("token")
    res.status(200).json({success:true,message:"logged out sucessfully"})
}  

export const verifyEmail = async (req,res) => {
    const {code} = req.body 
    try {
        const user = await User.findOne({
            verificationToken:code,
            verificationTokenExpiresAt:{$gt:Date.now()}    //$gt => supérieur à Date.now()  (s'assurer que le token n'a pas expiré)
            })
            if(!user){
                return res.status(400).json({success:false,message:"invalid or expired code"})
            }
            user.isVerified = true 
            user.verificationToken = undefined 
            user.verificationTokenExpiresAt = undefined //ou NULL
            await user.save()    //enregistrer les modifications sur le user 
            await welcomeEmail(user.email,user.name)
            res.status(200).json({success:true,message:"email verified successfully",user:{...user._doc,password:undefined}})
    } catch (error) {
        console.log("error in verified email",error)
        res.status(500).json({success:false,message:"server error"})    //500:erreur coté serveur
    }
}

export const forgotPassword = async (req,res) => {
    const {email} = req.body 
    try {
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({success:false,message:"user not found"})
        const resetToken = crypto.randomBytes(20).toString("hex")   //générarion d'un token transformé en string 
        const resetTokenExpiresAt = Date.now() + 1*60*60*1000
        user.resetPasswordToken = resetToken 
        user.resetPasswordExpiresAt = resetTokenExpiresAt
        await user.save()
        await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`)
        res.status(200).json({success:true,message:"password reset link sent to your email"})
    } catch (error) {
        console.log("error in forgot password",error)
        res.status(400).json({success:false,message:error.message})
    }
}

export const resetPassword = async (req,res) => {
    try {
        const {token} = req.params 
        const {password} = req.body //nv mdp
        const user = await User.findOne({resetPasswordToken:token,resetPasswordExpiresAt:{$gt:Date.now()}})   //est ce qu'ils sont === 
        if(!user) return res.status(400).json({success:false,message:"invalid or expired reset token"})
        const hashedPassword = await bcryptjs.hash(password,10)   
        user.password = hashedPassword
        user.resetPasswordToken = undefined 
        user.resetPasswordExpiresAt = undefined 
        await user.save()
        await sendResetSuccessEmail(user.email)
        res.status(200).json({success:true,message:"password reset successfully"})
    } catch (error) {
        console.log("error in reset password",error)
        res.status(400).json({success:false,message:error.message})
    }
}

export const checkAuth = async(req,res) => {
    try {
        const user = await User.findById(req.userId).select("-password")
        if(!user) return res.status(400).json({success:false,message:"user not found"})
        res.status(200).json({success:true,user})    
    } catch (error) {
        console.log("error in check auth",error)
        res.status(400).json({success:false,message:error.message})
    }
}
