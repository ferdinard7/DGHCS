import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import { addStudentResult, deleteAllResultsByStudentId, deleteResultById, getAllResultsByStudentId, updateStudentResult } from "../controllers/result";

const resultRoutes: Router = Router();

// REGISTER ROUTE
// ONLY ADMIN CAN CREATE STUDENT RESULT
resultRoutes.post("/", [authMiddleware,adminMiddleware],errorHandler(addStudentResult));

resultRoutes.put("/:id", [authMiddleware, adminMiddleware], updateStudentResult);

resultRoutes.get("/:id", [authMiddleware, adminMiddleware], getAllResultsByStudentId);

// delete a result using it ID
resultRoutes.delete("/:id", [authMiddleware, adminMiddleware], deleteResultById);

// delete all the results of a particular student
resultRoutes.delete("/:id", [authMiddleware, adminMiddleware], deleteAllResultsByStudentId)


export default resultRoutes;