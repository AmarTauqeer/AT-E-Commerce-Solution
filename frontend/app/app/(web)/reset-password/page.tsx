"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPassword() {

    const params = useSearchParams();

    const token = params.get("token");

    const [password, setPassword] = useState("");
    
    const [loading, setLoading]= useState(false)

    const submit = async () => {
        setLoading(true)

        await axios.post(
            "http://localhost:8000/auth/reset-password",
            {
                token,
                password
            }
        );

        setLoading(false)
        alert("Password changed");
    };

    return (
        <>
            <div className="h-[80vh]]">
                <div className="max-w-sm mx-auto py-6">
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New Password"
                        className="mb-2"
                    />

                    <Button onClick={submit}>
                        {loading?<p>Processing...</p>:"Reset Password"}
                    </Button>
                </div>
            </div>

        </>
    );
}