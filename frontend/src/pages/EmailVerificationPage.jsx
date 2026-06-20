import React from 'react'
import { useRef,useState,useEffect } from 'react'    //garder des refs vers les inputs 
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore.js'

const EmailVerificationPage = () => {
    const [code, setcode] = useState(["" ,"", "","","",""])
    const inputRefs = useRef([])
    const navigate = useNavigate()

    const {error,isLoading,verifyEmail} = useAuthStore()

    const handleChange = (index,value) => {
        const newCode = [...code]  //copie du tableau code 
        if(value.length>1){
            const pastedCode = value.slice(0,6).split("")    //code copié-collé 
            for(let i=0;i<6;i++){
                newCode[i] = pastedCode[i] || ""
            }
            setcode(newCode)
            const lastFilledIndex = newCode.findLastIndex((digit)=>digit!=="")   //index du dernier input non vide
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5
            inputRefs.current[focusIndex].focus()   //mettre le focus sur le focusIndex
        }
        else{
            newCode[index] = value 
            setcode(newCode)
            if(value && index<5) {
                inputRefs.current[index+1].focus()
            }
        }
    } 

    const handleKeyDown = (index,e) => {
        if(e.key === "Backspace" && !code[index] && index>0){
            inputRefs.current[index-1].focus()
        } 
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const verificationCode = code.join("")   //joindre les chiffres de sorte a ce que ça fasse un nombre
        try {
            await verifyEmail(verificationCode)
            navigate("/")
            toast.success("email verified successfully !")
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        if(code.every((digit)=>digit!=="")){
            handleSubmit(new Event("submit"))   //déclenchement de l'évéement submit
        }
    },[code])   //à chaque changement de code le useEffect sera delenché 

  return (
    <div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
        <motion.div initial={{opacity:0,y:-50}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'>
            <h2 className='text-3xl font-bold mb-6 text-center bg-linear-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>Verify your email</h2>
            <p className='text-center text-gray-300 mb-6'>Enter the 6 digit code sent to your email address</p>
            <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='flex justify-between'>
                    {code.map((digit,index)=>(
                        <input
                        key={index}
                        ref={(el)=>(inputRefs.current[index]=el)}    //garder une référence vers chaque input (el représentant l'input (la case))
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e)=>handleChange(index,e.target.value)}
                        onKeyDown={(e)=>handleKeyDown(index,e)}
                        className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none'
                        />
                    ))}
                </div>
                {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
                <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} type="submit" disabled={isLoading || code.some((digit)=>!digit)}
                    className='mt-5 w-full py-3 px-4 bg-linear-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
                    >
                    {isLoading ? "Verifying ..." : "Verify email"}
                </motion.button>
            </form>
        </motion.div>
    </div>
  )
}

export default EmailVerificationPage