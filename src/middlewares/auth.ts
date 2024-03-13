import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { prismaClient } from "..";
import { JWT_SECRET } from "../secrets";


const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token;
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];

            if (!token) {
                return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
            }

            jwt.verify(token, JWT_SECRET || '', async (err, decoded: any) => {
                if (err) {
                    return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
                }

                const user = await prismaClient.user.findFirst({
                    where: {
                        email: decoded.user.email
                    }
                });

                if (!user) {
                    return next(new UnauthorizedException("User not found", ErrorCode.USER_NOT_FOUND));
                }

                (req as any).user = user;
                next();
            });
        } else {
            return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
        }
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
}

export default authMiddleware;

