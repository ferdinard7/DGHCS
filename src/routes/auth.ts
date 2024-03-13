import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import { currentUser, deleteUser, login, searchUser, signup, updateUser } from "../controllers/auth";
import adminMiddleware from "../middlewares/admin";
import { forgotPassword } from "../controllers/password";
// import adminMiddleware from "../middlewares/admin";

const authRoutes: Router = Router();

// REGISTER ROUTE
// ONLY ADMIN CAN CREATE NEW STUDENT
authRoutes.post("/signup", [authMiddleware, adminMiddleware], errorHandler(signup));


authRoutes.post("/login", errorHandler(login));
authRoutes.get("/me", [authMiddleware], errorHandler(currentUser));
authRoutes.put("/update", [authMiddleware, adminMiddleware], updateUser);
authRoutes.delete("/delete", [authMiddleware, adminMiddleware], deleteUser);
authRoutes.get("/:query", searchUser);
// FORGOT PASSWORD
authRoutes.post("/forgot-password", forgotPassword);

export default authRoutes;