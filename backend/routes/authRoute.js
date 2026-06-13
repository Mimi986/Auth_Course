import express from "express"

const router = express.Router()

import {login,signup,logout,verifyEmail,forgotPassword,resetPassword,checkAuth} from "../controllers/authController.js"
import { verifyToken } from "../middlewares/verifyToken.js"

router.post("/signup",signup)
router.post("/login",login)
router.get("/logout",logout)
router.post("verify-email",verifyEmail)
router.post("forgot-password",forgotPassword)
router.post("reset-password/:token",resetPassword)
router.get("/check-auth",verifyToken,checkAuth)

export default router   //appel sans les {} et avec ke nom qu'on veut 