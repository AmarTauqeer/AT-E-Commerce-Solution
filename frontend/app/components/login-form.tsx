'use client'
import { Eye, EyeOff, Loader2Icon } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import z from "zod"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { LoginFormSchema } from "@/app/schemas/login-schema"
import { loginUser } from "@/app/services/auth"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { InputGroup, InputGroupAddon } from "./ui/input-group"

const LoginForm = () => {

    const form = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            username: "test@test.com",
            password: "test",
            role: "2",
        },
    })

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    async function handleSubmit(data: z.infer<typeof LoginFormSchema>) {
        setLoading(true);

        const jsonData = {
            username: data.username,
            password: data.password,
            role: parseInt(data.role)
        }
        const response = await loginUser(jsonData)
        
        if (await response.detail) {
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

    const handlePassword=()=>{
        setShowPassword(!showPassword)
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
                                        <Input placeholder="email" {...field} className="mb-2 border-1 focus-visible:ring-0 focus-visible:ring-transparent" height={2} />
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
                                    <InputGroup>
                                        <Input type={showPassword ? "text" : "password"} placeholder="*******" {...field} className="mb-1 border-none focus-visible:ring-0 focus-visible:ring-transparent" />
                                        <InputGroupAddon align="inline-end" className="px-2 hover:cursor-pointer">
                                            {showPassword ? <EyeOff onClick={handlePassword} /> : <Eye onClick={handlePassword} />}
                                        </InputGroupAddon>
                                    </InputGroup>
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

        </>
    )
}

export default LoginForm
