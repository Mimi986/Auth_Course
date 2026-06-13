import express from "express"
import dotenv from "dotenv"
import {connectDB} from "./db/connectDB.js"
import authRouter from "./routes/authRoute.js"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()

app.use(express.json())    //lire les données sous fromat json(middleware)

// app.get("/",(req,res)=>{
//     res.send("hello world")
// })

app.use(cookieParser())    //pour pouvoir lire les cookies
app.use("/api/auth",authRouter)

const port = process.env.PORT || 3000
app.listen(port,()=>{
    connectDB()
    console.log(`server is running on port ${port}`)
})