import express from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/error";

const app = express();

app.use(express.json());
app.use(errorMiddleware);
app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
    log:["query"]
})


app.listen(PORT, () => {
    console.log(`App working on port ${PORT}`)
})


// datasource db {
//     provider = "postgresql"
//     url      = env("DATABASE_URL")
//   }