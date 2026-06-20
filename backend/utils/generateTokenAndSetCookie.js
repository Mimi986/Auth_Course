import jwt from "jsonwebtoken"

export const generateTokenAndSetCookie = (res,userId) => {
    const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"7d"})    //le id sera stocké dans le token  

res.cookie("token",token,{
    httpOnly:true,
    maxAge:7*24*60*60*1000
})
return token 
}