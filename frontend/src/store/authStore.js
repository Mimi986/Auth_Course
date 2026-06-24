import {create} from 'zustand'
import axios from 'axios'


const API_URL = "http://localhost:3000/api/auth"

 export const useAuthStore = create ((set)=>({
    user:null,
    isAuthenticated : false , 
    error:null,
    isLoading:false,
    isCheckingAuth:true,
    message:null ,

    signup:async (email,password,name) => {
        set({isLoading:true,error:null})
        try {
            const response = await axios.post(`${API_URL}/signup`,{email,password,name})
            set({user:response.data.user,isAuthenticated:true,isLoading:false})   //une fois que le back renvoie une réponse on modifie les données
        } catch (error) {
            set({error:error.response.data.message || "error signing up",isLoading:false})
            throw error 
        }
    },
    verifyEmail : async (code) => {
        set({isLoading:true,error:null})
        try {
            const response = await axios.post(`${API_URL}/verify-email`,{code})
            set({user:response.data.user,isAuthenticated:true,isLoading:false})   //une fois que le back renvoie une réponse on modifie les données
        } catch (error) {
            set({error:error.response.data.message || "error verifying email",isLoading:false})
            throw error 
        }
    },
    checkAuth : async () => {
        set({isCheckingAuth:true,error:null})
        try {
            const response = await axios.get(`${API_URL}/check-auth`)
            set({user:response.data.user,isAuthenticated:true,isCheckingAuth:false})
        } catch (error) {
            set({error:null,isCheckingAuth:false,isAuthenticated:false})    //error est à null car il ne peut pas avpoir d'erreur : soit le user est authnetifié soit non 
        }
    },
    login : async (email,password) => {
        set({isLoading:true,error:null})
        try {
            const response = await axios.post(`${API_URL}/login`,{email,password})   //post === envoyer les données email et password vers la route là
            set({isAuthenticated:true,user:response.data.user,error:null,isLoading:false})
        } catch (error) {
            set({error:error.response?.data?.message || "error logging in",isLoading:false})   //pour éviter que le code crash : soit le message d'erreur est affiché soit ce qu'il y'a le || sera affiché 
            throw error 
        }
    },
    logout : async() => {
        set({isLoading:true,error:null})
        try {
            await axios.get(`${API_URL}/logout`)
            set({user:null,isAuthenticated:false,error:null,isLoading:false})
        } catch (error) {
            set({error:"error logging out",isLoading:false})
            throw error 
        }
    },
    forgotPassword : async (email) => {
        set({isLoading:true,error:null})
        try {
            const response = await axios.post(`${API_URL}/forgot-password`,{email})
            set({message:response.data.message,isLoading:false})
        } catch (error) {
            console.log("BACKEND ERROR",error.response?.data)
            set({error:error.response?.data?.message || "error sending reset password email",isLoading:false})
            throw error 
        }
    },
    resetPassword : async (token,password) => {
        set({isLoading:true,error:null})
        try {
            const response = await axios.post(`${API_URL}/reset-password/${token}`,{password})
            set({message:response.data.message,isLoading:false})
        } catch (error) {
            set({error:error.response?.data?.message || "error resetting password password",isLoading:false})
            throw error 
        }
    }
 }))