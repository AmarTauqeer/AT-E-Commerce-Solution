"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";

export default function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [loading, setLoading]= useState(false)

    const submit = async () => {
        setLoading(true)

        await axios.post(
            "http://localhost:8000/auth/forgot-password",
            { email }
        );
        setLoading(false)

        alert("Check your email.");
    };

    return (
        <>
            <div className="h-[80vh]]">
                <div className="max-w-sm mx-auto py-6">
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="mb-2"
                    />

                    <Button onClick={submit}>
                        {loading?<p>Processing...</p>:"Send Reset Link"}
                    </Button>
                </div>
            </div>

        </>
    );
}