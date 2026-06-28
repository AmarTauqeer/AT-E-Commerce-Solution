import z from "zod"

export const LoginFormSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
    role: z.string().min(1, {
        message: "role can't be empty.",
    }),
})