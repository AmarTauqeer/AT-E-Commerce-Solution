'use client'

import { Suspense, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Loader2Icon } from "lucide-react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { redirect, useRouter } from "next/navigation"
import { getUser, getUserAndPermissions, getUsers, loggedIn, userAddOrUpdateFormData } from "@/app/services/auth"
import { getPermission } from "@/app/services/user-permissions"


export type ProfileType = {
    response: {
        id: string,
        username: string,
        is_authenticated: boolean,
        email: string,
        password: string,
        first_name: string,
        last_name: string,
        role: { id: number, role_name: string }

    }
}

const FormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    password: z.string().min(2, { message: "Password must be at least 2 characters." }),
    first_name: z.string(),
    last_name: z.string(),
    role_id: z.number()
})

export type permissionType = {
    resource: number,
    Read: boolean,
    Write: boolean,
    Update: boolean,
    Delete: boolean
}

export const Profile = () => {

    const { setValue } = useForm();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
            first_name: "",
            last_name: "",
            role_id: 0,
        },
    })

    const [role, setRole] = useState("user")
    const [id, setId] = useState(1)
    const [roleId, setRoleId] = useState()
    const [permissions, setPermissions] = useState<permissionType>()
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (data: z.infer<typeof FormSchema>) => {

        let insertOrUpdate = "Update"
        setLoading(true)
        //update user info

        const jsonData = {
            email: data.email,
            password: data.password,
            id: id,
            first_name: data.first_name,
            last_name: data.last_name,
            role_id: roleId,
        }

        const response = await userAddOrUpdateFormData(jsonData)

        if (response != 405 && response.id != undefined) {
            router.replace("/about-us")
            setLoading(false)
            // props.setIsOpen(false);
            toast.success(<span className="text-green-500">{insertOrUpdate} Successful.</span>)
            setTimeout(() => {
                setLoading(false);
            }, 10000);

        } else {
            toast.error(<span className="text-red-500">{insertOrUpdate} Failed.</span>)
            setLoading(false)
            return false;
        }

    }

    useEffect(() => {

        const getLoginStatus = async () => {
            const loginStatus = await loggedIn();
            if (loginStatus == "loggedout") {
                redirect("/admin-login");
            }
        }
        getLoginStatus()


        const getUserRole = async () => {
            const getData = await getUserAndPermissions()

            const filterUsers = await getData.user
            if (filterUsers.email) {
                let role_name = filterUsers.role.role_name
                setRole(role_name)
                setRoleId(filterUsers.role.id)
                const userId = filterUsers.id
                setId(userId)
                const filterPermission = await getData.permissions
                //  for profile resource id =5
                const permissionsDb = filterPermission.filter((p: any) => p.resource == 5)
                setPermissions(permissionsDb)

                if (role_name == 'user') {
                    toast.error(<span className="text-red-500">You don't have permission to access this page!</span>)
                    router.replace("/admin-login");
                } else {
                    form.setValue('email', filterUsers.email);
                    form.setValue('first_name', filterUsers.first_name);
                    form.setValue('last_name', filterUsers.last_name);
                    form.setValue('role_id', filterUsers.role.id);
                }
            }
        }
        getUserRole()
    }, [])

    return (
        <>
            {role && role == 'user' ? "" : <div className="py-5 w-full md:w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>User Information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Suspense fallback={<div>loading...</div>}>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSubmit)} className="pt-5 py-1 w-full">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="lg:flex lg:flex-row lg:gap2 xl:flex xl:flex-row xl:gap-2 mt-2">
                                                    <FormLabel className="lg:w-[20%] xl:w-[20%]">Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" placeholder="email" {...field} />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="first_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="lg:flex lg:flex-row lg:gap2 xl:flex xl:flex-row xl:gap-2 mt-2">
                                                    <FormLabel className="lg:w-[20%] xl:w-[20%] ">First Name</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" placeholder="First name" {...field} />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="last_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="lg:flex lg:flex-row lg:gap2 xl:flex xl:flex-row xl:gap-2 mt-2">
                                                    <FormLabel className="lg:w-[20%] xl:w-[20%]">Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" placeholder="Last name" {...field} />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="lg:flex lg:flex-row lg:gap2 xl:flex xl:flex-row xl:gap-2 mt-2">
                                                <FormLabel className="w-[20%]">Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="password" {...field} />
                                                </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex flex-row justify-center items-center mt-2 md:justify-end">
                                        <Button type="submit" disabled={loading} className="basis-1/3 mr-0.5">
                                            {loading && <><Loader2Icon className="animate-spin" /> Please wait</>}
                                            {!loading && <p>Update</p>}
                                        </Button>
                                        <Button className="basis-1/3 ml-0.5" type="button" onClick={() => redirect("/about-us")}>Cancel</Button>

                                    </div>

                                </form>
                            </Form>
                        </Suspense>

                    </CardContent>

                </Card>
            </div>}

        </>
    )
}