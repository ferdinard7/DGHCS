import { hashSync } from "bcrypt";
import { prismaClient } from "..";
import { sendEmail, sendForgotPasswordEmail } from "./sendemail";
import { Request, Response } from "express";


const generateNewPassword = (): string => {
    // Generate a random 6-digit number
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `${randomNumber}`;
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        let { studentID, email } = req.body;

        if (!studentID && !email) {
            return res.status(400).json({ message: 'Please provide student ID or email' });
        }

        let user;

        if (studentID) {
            // If student ID is provided, find user by student ID
            user = await prismaClient.user.findUnique({ where: { studentID } });
        } else {
            // If email is provided, find user by email
            user = await prismaClient.user.findUnique({ where: { email } });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a new password
        const newPassword = generateNewPassword();

        // Update the user's password in the database
        const updatedUser = await prismaClient.user.update({
            where: { id: user.id },
            data: { password: hashSync(newPassword, 10) } // Hash the new password before updating
        });

        // Send an email to the user with the new password
        await sendForgotPasswordEmail(user.email, newPassword);

         res.json({ message: 'New password sent to email' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};