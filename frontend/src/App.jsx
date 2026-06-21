import FlottingShape from "./components/FlottingShape"
import { Routes,Route } from "react-router-dom"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import EmailVerificationPage from "./pages/EmailVerificationPage"
import {Toaster} from 'react-hot-toast'
import { useAuthStore } from "./store/authStore"
import { useEffect } from "react"
import { Navigate } from "react-router-dom"
import DashboardPage from "./pages/DashboardPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"

const RedirectAuthenticatedUser = ({children})=>{
  const {isAuthenticated,user} = useAuthStore()
  if(isAuthenticated && user.isVerified) {
    return <Navigate to="/"/>
  }
  return children
}

const ProtectedRoute = ({children}) => {
  const {isAuthenticated,user} = useAuthStore()
  if(!isAuthenticated){
    return <Navigate to="/login"/>
  }
  if(!user.isVerified){
    return <Navigate to="/verify-email"/>
  }
  return children 
  }
function App() {
  
const {isCheckingAuth,checkAuth} = useAuthStore()

useEffect(()=>{
  checkAuth()
},[checkAuth])

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
        <FlottingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0}/>
        <FlottingShape color="bg-green-500" size="w-48 h-48" top="70%" left="80%" delay={5}/>
        <FlottingShape color="bg-green-500" size="w-32 h-32" top="40%" left="-10%" delay={2}/>
        <Routes>
          <Route path="/" element={<ProtectedRoute><DashboardPage/></ProtectedRoute>}/>
          <Route path="/signup" element={<RedirectAuthenticatedUser><SignUpPage/></RedirectAuthenticatedUser>}/>
          <Route path="/login" element={<RedirectAuthenticatedUser><LoginPage/></RedirectAuthenticatedUser>}/>
          <Route path="/verify-email" element={<EmailVerificationPage/>}/>
          <Route path="/forgot-password" element={<RedirectAuthenticatedUser><ForgotPasswordPage/></RedirectAuthenticatedUser>}/>
          <Route path="/reset-password/:token" element={<RedirectAuthenticatedUser><ResetPasswordPage/></RedirectAuthenticatedUser>}/>
        </Routes>
        <Toaster/>
      </div>
    </>
  )
}

export default App
