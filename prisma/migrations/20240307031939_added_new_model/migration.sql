-- CreateTable
CREATE TABLE `results` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentID` VARCHAR(191) NOT NULL,
    `subjectCode` VARCHAR(191) NOT NULL,
    `term` VARCHAR(191) NOT NULL,
    `firstTest` INTEGER NULL DEFAULT 0,
    `secondTest` INTEGER NULL DEFAULT 0,
    `thirdTest` INTEGER NULL DEFAULT 0,
    `TotalTestScore` INTEGER NULL,
    `ExamScore` INTEGER NULL DEFAULT 0,
    `OverallTotal` INTEGER NULL,
    `studentGrade` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `results` ADD CONSTRAINT `results_studentID_fkey` FOREIGN KEY (`studentID`) REFERENCES `users`(`studentID`) ON DELETE RESTRICT ON UPDATE CASCADE;
