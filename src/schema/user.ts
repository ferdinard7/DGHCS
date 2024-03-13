import { z } from "zod";

export const signupSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    grade: z.string(),
    studentID: z.string().optional(), // Make studentID optional
    department: z.string().optional(),
})