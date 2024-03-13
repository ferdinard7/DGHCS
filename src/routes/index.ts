import { Router } from "express";
import authRoutes from "./auth";
import resultRoutes from "./result";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/result", resultRoutes);

export default rootRouter;