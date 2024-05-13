import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import { addStudentResult, deleteAllResultsByStudentId, deleteResultById, getAllResultsByStudentId, updateStudentResult } from "../controllers/result";

const resultRoutes: Router = Router();

// REGISTER ROUTE
// ONLY ADMIN CAN CREATE STUDENT RESULT
resultRoutes.post("/", [authMiddleware],errorHandler(addStudentResult));

resultRoutes.put("/:id", [authMiddleware], updateStudentResult);

resultRoutes.get("/:id", [authMiddleware], getAllResultsByStudentId);

// delete a result using it ID
resultRoutes.delete("/:id", [authMiddleware], deleteResultById);

// delete all the results of a particular student
resultRoutes.delete("/:id", [authMiddleware], deleteAllResultsByStudentId)


export default resultRoutes;