"use client";

import { usePathname, useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { logout } from "@/app/services/auth";


const UserLogout = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    async function handleClick(event: SyntheticEvent) {
        setLoading(true)
        const logoutStatus = await logout()
        toast.success(<span className="text-green-500">Logout Successful.</span>)
        router.replace("/user-login");
        setLoading(false);
    }


    return (
        <>
            <div className="h-[95vh]">
                <div className="max-w-md mx-auto py-5">

                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle>Logout</CardTitle>
                            <CardDescription>Are you sure you want to logout?</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button type="button" className="w-full mt-2" disabled={loading}>
                                {loading && <><Loader2Icon className="animate-spin" /> Please wait</>}
                                {!loading && <p onClick={handleClick}>Logout</p>}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default UserLogout;
