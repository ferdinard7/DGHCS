import { NextFunction, Request, Response} from "express";
import { prismaClient } from "..";
import { resultSchema } from "../schema/result";


// ADD STUDENT RESULT
export const addStudentResult = async (req: Request, res: Response) => {
    try {
        // Validate request body against result schema
        const inputData = resultSchema.parse(req.body);

        // Create student result
        const newResult = await prismaClient.result.create({
            data: {
                studentID: inputData.studentID,
                subjectCode: inputData.subjectCode,
                term: inputData.term,
                firstTest: inputData.firstTest,
                secondTest: inputData.secondTest,
                thirdTest: inputData.thirdTest,
                ExamScore: inputData.ExamScore,
                TotalTestScore: inputData.TotalTestScore,
                OverallTotal: inputData.OverallTotal,
                studentGrade: inputData.studentGrade
            }
        });

        res.json(newResult);
    } catch (error) {
        console.error('Error adding student result:', error);
        res.status(400).json({ message: 'Invalid data provided' });
    }
};


export const updateStudentResult = async (req: Request, res: Response) => {
    try {
        // Validate request body against result schema
        const inputData = resultSchema.parse(req.body);

        const resultId = parseInt(req.params.id); 

        // Check if the result with the given resultId exists
        const existingResult = await prismaClient.result.findUnique({
            where: {
                id: resultId // No need to parse to integer
            }
        });

        if (!existingResult) {
            return res.status(404).json({ message: 'Result not found' });
        }

        // Update the student result
        const updatedResult = await prismaClient.result.update({
            where: {
                id: resultId // No need to parse to integer
            },
            data: inputData // Directly pass inputData object
        });

        res.json(updatedResult);
    } catch (error) {
        console.error('Error updating student result:', error);
        res.status(400).json({ message: 'Invalid data provided' });
    }
};



export const getAllResultsByStudentId = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;

        // Get all results associated with the studentID
        const results = await prismaClient.result.findMany({
            where: {
                studentID: studentId
            }
        });

        if (results.length === 0) {
            return res.status(404).json({ message: 'No results found for the student' });
        }

        res.json(results);
    } catch (error) {
        console.error('Error retrieving results:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a result using it ID
export const deleteResultById = async (req: Request, res: Response) => {
    try {
        const  { id }= req.params;

        // Delete the result based on its id
        const deletedResult = await prismaClient.result.delete({
            where: {
                id: parseInt(id) // Convert resultId to a number
            }
        });

        res.json(deletedResult);
    } catch (error) {
        console.error('Error deleting result:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Delete all results of a particular user 
export const deleteAllResultsByStudentId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Delete all results associated with the studentID
        const deletedResults = await prismaClient.result.deleteMany({
            where: {
                studentID: id
                }
        });

        res.json(deletedResults);
    } catch (error) {
        console.error('Error deleting results:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};