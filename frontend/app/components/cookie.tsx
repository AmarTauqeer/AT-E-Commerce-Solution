"use client";

import { api } from "@/app/lib/axios";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function Consent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        checkConsent();
    }, []);

    async function checkConsent() {
        try {
            const res = await api.get("/auth/consent");

            if (!res.data.consent) {
                setVisible(true);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function save(choice: string) {
        await api.post("/auth/consent", null, {
            params: {
                choice,
            },
        });

        setVisible(false);
    }

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">

            <div className="w-[90%] max-w-lg rounded-xl border-2 p-8 shadow-xl">

                <h2 className="text-2xl font-bold">
                    Cookie Consent
                </h2>

                <p className="mt-4">
                    We use cookies to improve your experience,
                    analyze traffic, and personalize content.
                    You can accept or reject optional cookies.
                </p>

                <div className="mt-8 flex justify-end gap-3">

                    <Button
                    variant="outline"
                        onClick={() => save("rejected")}
                        className="rounded-2xl px-5 py-2"
                    >
                        Reject
                    </Button>

                    <Button
                    variant="outline"
                        onClick={() => save("accepted")}
                        className="rounded-2xl px-5 py-2"
                    >
                        Accept
                    </Button>

                </div>

            </div>

        </div>
    );
}