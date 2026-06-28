"use client";

import { useEffect, useState } from "react";
import { useSearchParams }
  from "next/navigation";
import { api } from "@/app/lib/axios";

export default function VerifyPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const params =
    useSearchParams();

  useEffect(() => {

    const token =
      params.get("token");

    if (!token) return;

    setLoading(true)
    const get_verification = async () => {
      const response = await api.post("auth/verify-email", {}, {
        params: {
          token: token,
        },
      })
      const message = await response.data.message
      if (message) {
        setMessage(message)
      } else {
        setMessage("There are some issues to verify your account!")
      }

    }
    get_verification()
    setLoading(false)

  }, [params]);

  return (
    <>
      {console.log(loading)}
      {loading ? <span>Verifying account...</span> : <span>{message}</span>}
    </>
  );
}