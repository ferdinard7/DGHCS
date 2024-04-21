import { NextFunction, Request, Response} from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import { signupSchema } from "../schema/user";
import { NotFound } from "../exceptions/not-found";
import { IncorrectPassword } from "../exceptions/incorect-password";
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from "./sendemail";


const generateStudentID = (): string => {
    // Generate a random 3-digit number
    const randomNumber = Math.floor(100 + Math.random() * 900);
    return `${randomNumber}`;
  };


  export const homePage = (req: Request, res: Response) => {
     res.status(200).send({message: "WELCOME TO DCGHS BACKEND"})
  }


  export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { department, name, email, password, grade } = req.body;

        signupSchema.parse(req.body);

        // Generate a UUID for studentID
        const studentID = "DGHCS" + generateStudentID();
        console.log(studentID);

        // Convert inputs to lowercase
        name = name.toLowerCase();
        email = email.toLowerCase();
        grade = grade.toLowerCase();
        password = password.toLowerCase();
        if (department) {
            department = department.toLowerCase();
        } else {
            department = null;
        }

        let foundUser = await prismaClient.user.findFirst({ where: { email } });
        if (foundUser) {
            next(new BadRequestsException("User already exists", ErrorCode.USER_ALREADY_EXIST));
        }

        // Send welcome email to the user
        await sendEmail(email, studentID, password);

        const newUser = await prismaClient.user.create({
            data: {
                name,
                email,
                password: hashSync(password, 10),
                grade,
                studentID,
                department,
            }
        });

        res.json({ message: "Your student ID is " + studentID, newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// LOGIN

export const login = async (req: Request, res: Response, next: NextFunction) => {

    try {
        let { studentID, email, name, password } = req.body;

        // Determine whether email or name is provided
        let user;
        if (email) {
            email = email.toLowerCase();
            user = await prismaClient.user.findFirst({ where: { email } });
        } else if (name) {
            name = name.toLowerCase();
            user = await prismaClient.user.findFirst({ where: { name } });
        } else if (studentID) {
            studentID = studentID.toUpperCase();
            user = await prismaClient.user.findFirst({ where: { studentID }})
        } 
        else {
            throw new Error('Please provide either email or name for login');
        }

        if (!user) {
            throw new NotFound("User not found", ErrorCode.USER_NOT_FOUND)
        }

        // Compare passwords
        const passwordMatch = compareSync(password, user.password);

        if (!passwordMatch) {
            next(new IncorrectPassword("Incorrect password", ErrorCode.INCORRECT_PASSWORD)
        )}

        // Generate JWT token
        const token = jwt.sign({  user: {
            // password: user.password,
            email: user.email,
            userId: user.id,
            role: user.role,
            studentID: user.studentID,

          },}, JWT_SECRET, { expiresIn: '1h' });

        res.json({ ...user, token });
    } catch (err) {
        console.log(err + "error")
    }  
    
};

// GET CURRENT/LOGGED IN USER

export const currentUser = async(req: Request, res: Response) => {
    res.json((req as any).user);
}


// UPDATE USER DETAILS

export const updateUser = async(req: Request, res: Response) => {
    try {
        const { studentID, updatedData } = req.body;

        // Query the user by studentID to retrieve their unique identifier
        const user = await prismaClient.user.findFirst({
            where: {
                studentID: studentID
            }
        });

        // Throw error if user not found
        if (!user) {
            throw new NotFound('User not found', ErrorCode.USER_NOT_FOUND);
        }

        // Update the user using their unique identifier
        const updatedUser = await prismaClient.user.update({
            where: {
                id: user.id 
            },
            data: updatedData // Object containing the fields to update
        });

        // Send response with details of updated user
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


// DELETE A USER

export const deleteUser = async(req: Request, res: Response) => {
    try {
        const { studentID } = req.body;

        // Query the user by studentID to retrieve their unique identifier
        const user = await prismaClient.user.findFirst({
            where: {
                studentID: studentID
            }
        });

        // Throw error if user not found
        if (!user) {
            throw new NotFound('User not found', ErrorCode.USER_NOT_FOUND);
        }

        // Delete the user using their unique identifier
        const deletedUser = await prismaClient.user.delete({
            where: {
                id: user.id // Assuming `id` is the field storing the unique identifier
            }
        });

        // Send response with details of deleted user
        res.json(deletedUser);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// GET USER BY STUDENTID OR NAME OR EMAIL

export const searchUser = async(req: Request, res: Response) => {
    try {
        const query = req.params.query;

        // Construct the search condition dynamically
        const user = await prismaClient.user.findFirst({
            where: {
                OR: [
                    { email: query.toLowerCase() },
                    { studentID: query },
                    { name: query.toLowerCase()},
                ],
            },
        });

        if (!user) {
            throw new NotFound('User not found', ErrorCode.USER_NOT_FOUND);
        }

        res.json(user);
    } catch (error) {
        console.error('Error searching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}