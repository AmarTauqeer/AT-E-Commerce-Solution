import z from "zod";

export const UserProfileSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    password: z.string().min(2, { message: "Password must be at least 2 characters." }),
    first_name: z.string(),
    last_name: z.string(),
    role_id: z.number()
})