import {transporter} from "./nodemailer.config.js"
import { VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js"

export const sendVerificationEmail = async (email,verificationToken) => {
    try {
        const response = await transporter.sendMail({
            from:`"Mounia" <${process.env.EMAIL_USER}`,
            to:email,
            subject:"Verify your email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken)
        })
        console.log("email sent successfully",response.messageId)    //récupération du message
    } catch (error) {
        console.error(`error sending verification email`,error)
        throw new Error (`error sending verification email:${error}`)
    }
}

export const welcomeEmail = async (email,name) => {
    try {
        const htmlContent = `
        <h1>Welcome ${name}</h1>
        <p>Thanks for joining us</p>
        `
        const response = await transporter.sendMail({
            from:`"Mounia" <${process.env.EMAIL_USER}`,
            to:email,
            subject:"Welcome",
            html:htmlContent})

        console.log("welcome email sent successfully",response.messageId)
    } catch (error) {
        console.error(`error sending welcome email`,error)
        throw new Error (`error sending welcome email:${error}`)
    }
}

export const sendPasswordResetEmail = async (email,resetURL) => {
    try {
        const response = await transporter.sendMail({
            from:`"Mounia" <${process.env.EMAIL_USER}`,
            to:email,
            subject:"Reset your password",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL)
        })
        console.log("password reset email sent successfully",response.messageId) 
    } catch (error) {
        console.error(`error sending password reset email`,error)
        throw new Error (`error sending password reset email:${error}`)
    }
}

export const sendResetSuccessEmail = async (email) => {
    try {
        const response = await transporter.sendMail({
            from:`"Mounia" <${process.env.EMAIL_USER}`,
            to:email,
            subject:"Password reset successfull",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE
        })
        console.log("password reset success email sent successfully",response.messageId)    //récupération du message
    } catch (error) {
        console.error(`error sending password reset success email`,error)
        throw new Error (`error sending password reset success email:${error}`)
    }
}