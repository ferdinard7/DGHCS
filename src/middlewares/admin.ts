import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";


const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Check if user is an admin
    // For example, you can check if the user role is 'ADMIN' in the JWT payload
    const userRole = (req as any).user.role; // Assuming the user role is included in the JWT payload
    if (userRole !== 'ADMIN') {
        res.status(403).json({ message: 'Forbidden - Only admins can access this resource' });
        return;
    }
    // If user is an admin, call next() to proceed to the next middleware or route handler
    next();
};

export default adminMiddleware;