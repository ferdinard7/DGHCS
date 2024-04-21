-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "studentID" TEXT,
    "password" TEXT NOT NULL,
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "results" (
    "id" SERIAL NOT NULL,
    "studentID" TEXT NOT NULL,
    "subjectCode" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "firstTest" INTEGER DEFAULT 0,
    "secondTest" INTEGER DEFAULT 0,
    "thirdTest" INTEGER DEFAULT 0,
    "TotalTestScore" INTEGER,
    "ExamScore" INTEGER DEFAULT 0,
    "OverallTotal" INTEGER,
    "studentGrade" TEXT,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_studentID_key" ON "users"("studentID");

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "users"("studentID") ON DELETE RESTRICT ON UPDATE CASCADE;
