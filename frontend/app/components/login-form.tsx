'use client'
import { Loader2Icon } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { redirect, useRouter } from "next/navigation"
import { toast } from "sonner"
import z from "zod"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { LoginFormSchema } from "@/app/schemas/login-schema"
import { loggedIn, loginUser } from "@/app/services/auth"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { getRole } from "@/app/services/role"

const LoginForm = () => {

    const form = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            username: "amar.tauqeer@gmail.com",
            password: "amar",
            role: "2",
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
            role: parseInt(data.role)
        }
        const response = await loginUser(jsonData)
        console.log(response)

        if (response.status_code !== undefined && response.status_code == 401) {
            toast.error(<span className="text-red-500">{response.detail}</span>)
            setLoading(false)
            return false
        }

        if (response.message == "Logged in without two factor authentication") {
            setLoading(false)
            toast.success(<span className="text-green-500">Login Successful.</span>)
            router.push("admin-dashboard")
        }

    }


    return (
        <>
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
                    {/* <FormField
                        control={form.control}
                        name="role"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                    <Select
                                        name={field.name}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >

                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="2">Admin</SelectItem>
                                                <SelectItem value="1">User</SelectItem>
                                                <SelectItem value="3">Guest</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}
                    <Button type="submit" className="w-full mt-2" disabled={loading}>
                        {loading && <><Loader2Icon className="animate-spin" /> Please wait</>}
                        {!loading && <p>Submit</p>}
                    </Button>
                    <div className="text-center mt-2 w-full">
                        Don't have an account? <Link href="/register" className="mouse-pointer text-sm">{" "}Register</Link>
                    </div>
                </form>
            </Form>

        </>
    )
}

export default LoginForm
