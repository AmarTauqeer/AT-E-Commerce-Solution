import z from "zod";

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