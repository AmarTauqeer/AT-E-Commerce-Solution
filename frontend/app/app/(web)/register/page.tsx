"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { email, z } from "zod"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { CheckCircle2Icon, Eye, EyeOff, Loader2Icon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { userAddOrUpdateFormData } from "../../services/auth";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";


export const RegisterSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
    passwordConfirm: z.string().min(3, {
        message: "Password confirm is required.",
    }),
    email: z.string().min(1, { message: "This field is required." })
        .email("This is not a valid email.")
})
    .refine((data) => data.password === data.passwordConfirm, {
        message: `Password and password confirm must be matched!`,
        path: ['passwordConfirm'],
    });

const Register = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: "amar",
            password: "amar",
            email: "amar.tauqeer@hotmail.com",
            passwordConfirm:"amar",
                },
    })

    const handlePassword = () => {
        setShowPassword(!showPassword)
    }
    const handlePasswordConfirm = () => {
        setShowPasswordConfirm(!showPasswordConfirm)
    }

    async function handleSubmit(data: z.infer<typeof RegisterSchema>) {
        setLoading(true);

        // setTimeout(() => {
        //   setLoading(false);
        // }, 10000);

        const jsonData = {
            first_name: data.username,
            last_name: data.username,
            password: data.password,
            email: data.email,
            role_id: 1,
            id:"0"

        }
        // console.log(jsonData)

        const response = await userAddOrUpdateFormData(jsonData)
        
        if (response==="Email is already registered with us.") {
             toast.error(<span className="text-red-500">{response}</span>)
             setLoading(false);
            return false;
            
        } else {
            toast.success(<span className="text-green-500">Registration Successful.</span>)
            router.replace("/user-login");
        }
        setLoading(false);
    }
    return (
        <div className="h-[95vh]">
            <div className="max-w-lg mx-auto py-5">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>Registration Form</CardTitle>
                        <CardDescription>Register Information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="pt-5 py-1">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="px-2 mt-2">User Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="username" {...field} className="mt-2 mb-2" />
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
                                            <FormLabel className="px-2 mt-2">Password</FormLabel>
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
                                <FormField
                                    control={form.control}
                                    name="passwordConfirm"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="px-2 mt-2">Password Confirm</FormLabel>
                                            <FormControl>
                                                <InputGroup>
                                                    <Input type={showPasswordConfirm ? "text" : "password"} placeholder="*******" {...field} className="mb-1 border-none focus-visible:ring-0 focus-visible:ring-transparent" />
                                                    <InputGroupAddon align="inline-end" className="px-2 hover:cursor-pointer">
                                                        {showPasswordConfirm ? <EyeOff onClick={handlePasswordConfirm} /> : <Eye onClick={handlePasswordConfirm} />}
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="px-2 mt-2">Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full mt-2" disabled={loading}>
                                    {loading && <><Loader2Icon className="animate-spin" /> Please wait</>}
                                    {!loading && <p>Submit</p>}
                                </Button>
                                <div className="text-center mt-4 w-full">
                                    Already have a account? <Link href="/user-login" className="mouse-pointer">{" "}Login</Link>
                                </div>

                            </form>
                        </Form>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default Register;

