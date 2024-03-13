import { z } from 'zod';

export const resultSchema = z.object({
    studentID: z.string(), // Assuming studentID is required
    subjectCode: z.string(),
    term: z.string(),
    firstTest: z.number().optional(),
    secondTest: z.number().optional(),
    thirdTest: z.number().optional(),
    ExamScore: z.number().optional(),
    TotalTestScore: z.number().optional(),
    OverallTotal: z.number().optional(),
    studentGrade: z.string().optional()
});