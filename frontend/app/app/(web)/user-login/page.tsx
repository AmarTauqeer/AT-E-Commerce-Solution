'use client'
import { Loader2Icon } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { redirect, useRouter } from "next/navigation"
import { toast } from "sonner"
import z from "zod"

import { LoginFormSchema } from "@/app/schemas/login-schema"
import { loggedIn, loginUser } from "@/app/services/auth"

import { getRole } from "@/app/services/role"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/app/lib/axios"


const UserLogin = () => {

    const form = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            username: "amar.tauqeer@hotmail.com",
            password: "tauqeer",
            role: "1",
        },
    })

    const [loading, setLoading] = useState(false);
    const [logged, setLogged] = useState("loggedout");

    const router = useRouter();

    async function handleSubmit(data: z.infer<typeof LoginFormSchema>) {
        setLoading(true);

        const jsonData = {
            username: data.username,
            password: data.password,
            role: 1
        }
        const response = await loginUser(jsonData)

        if (response.status_code !== undefined && response.status_code == 401) {
            toast.error(<span className="text-red-500">{await response.detail}.</span>)
            setLoading(false)
            return false
        }

        if (response.message == "Logged in without two factor authentication") {
            setLoading(false)
            toast.success(<span className="text-green-500">Login Successful.</span>)
            router.push("/two-factor-auth")

        }
    }


    return (
        <>
            <div className="h-[95vh]">
                <div className="max-w-md mx-auto py-5">

                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>Login Information</CardDescription>
                        </CardHeader>
                        <CardContent >
                            <div className="text-end mr-2 font-bold text-md">
                                <Link href="/admin-login" className="transition duration-250 hover:ease-in-out hover:text-green-900 hover:font-bold">Login as Admin</Link>
                            </div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSubmit)} className="pt-1 py-1">
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>User</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="email" {...field} className="mb-2" height={2} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="password" {...field} className="mb-1" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />


                                    <Button type="submit" className="w-full mt-2" disabled={loading}>
                                        {loading && <><Loader2Icon className="animate-spin" /> Please wait</>}
                                        {!loading && <p>Submit</p>}
                                    </Button>
                                    <div className="text-center mt-2 w-full">
                                        Don't have an account? <Link href="/register" className="mouse-pointer text-sm">{" "}Register</Link>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </>
    )
}

export default UserLogin
