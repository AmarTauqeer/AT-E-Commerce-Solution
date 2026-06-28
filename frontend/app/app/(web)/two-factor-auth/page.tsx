'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/app/lib/axios"
import { getUser } from "@/app/services/auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


const TwoFactorAuth = () => {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [step, setStep] = useState(1)
    const [loading, setLoading]= useState(false)


    const sendOtp = async () => {
        setLoading(true)
        await api.post("/auth/request-otp", { email })
        setStep(2)
        setLoading(false)
    }

    const verifyOtp = async () => {
        setLoading(true)
        await api.post("/auth/verify-otp", { email, otp })
        setLoading(false)
        // cookies are set automatically

        // get user
        const user = await getUser()

        if (user) {
            router.push("about")
        } else {
            console.log("issues")
            return false
        }
    }


    return (
        <>

            <div className="h-[80vh]]">
                <div className="max-w-sm mx-auto py-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>{step==1 || step==2 ?"Two Factor Authentication":"Login Information"}</CardDescription>
                        </CardHeader>
                        <CardContent >
                            {step === 1 && (
                                <>
                                    <label>Email</label>
                                    <Input className="mb-2" onChange={(e: any) => setEmail(e.target.value)} />
                                    <Button onClick={sendOtp}>{loading?<p>Processing...</p>:"Send OTP"}</Button>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <label>Otp</label>
                                    <Input className="mt-2 mb-2" onChange={(e: any) => setOtp(e.target.value)} />
                                    <Button onClick={verifyOtp}>{loading?<p>Processing...</p>:"Verify"}</Button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default TwoFactorAuth
