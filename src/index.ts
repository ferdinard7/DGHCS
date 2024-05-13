import express from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/error";
import cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(errorMiddleware);
app.use("/api", rootRouter);

async function testConnection() {
    const prisma = new PrismaClient();
  
    try {
      await prisma.$connect();
      console.log('Database connection successful');
    } catch (error) {
      console.error('Unable to connect to database:', error);
    } 
  }

//   finally {
//     await prisma.$disconnect();
//   }
  testConnection();

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

// datasource db {
//     provider = "postgresql"
//     url = env("POSTGRES_PRISMA_URL") // uses connection pooling
//   }