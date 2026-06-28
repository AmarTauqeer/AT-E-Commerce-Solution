'use client'
// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { Input } from "../../../components/ui/input"
// import { Button } from "../../../components/ui/button"
// import Login from "@/app/page"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LoginForm from "@/components/login-form"
// import { api } from "@/app/lib/axios"
import { loggedIn } from "@/app/services/auth"
import { redirect } from "next/navigation"
import { useEffect } from "react"


const AdminLogin = () => {

    // const router = useRouter()
    // const [email, setEmail] = useState("")
    // const [otp, setOtp] = useState("")
    // const [step, setStep] = useState(1)


    // const sendOtp = async () => {
    //     await api.post("/auth/request-otp", { email })
    //     setStep(2)
    // }

    // const verifyOtp = async () => {
    //     await api.post("/auth/verify-otp", { email, otp })
    //     // cookies are set automatically

    //     // get user
    //     const response = await getUser()
    //     console.log(response)

    // }
    useEffect(() => {
        const getloginStatus = async () => {
            const loginStatus = await loggedIn();
            console.log(loginStatus)
            if (loginStatus == "loggedin") {
                redirect("/admin-dashboard");
            }
        }
        getloginStatus()
    })

    return (
        <>
            <div className="h-[80vh]]">
                <div className="max-w-sm mx-auto py-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Admin Login</CardTitle>
                            <CardDescription>Login Information</CardDescription>
                        </CardHeader>
                        <CardContent >
                            <LoginForm />
                        </CardContent>
                    </Card>
                </div>
            </div>
            {/* 
            {step === 1 && (
                <>
                    <Input onChange={(e) => setEmail(e.target.value)} />
                    <Button onClick={sendOtp}>Send OTP</Button>
                </>
            )}

            {step === 2 && (
                <>
                    <Input onChange={(e) => setOtp(e.target.value)} />
                    <Button onClick={verifyOtp}>Verify</Button>
                </>
            )} */}

        </>
    )
}

export default AdminLogin
