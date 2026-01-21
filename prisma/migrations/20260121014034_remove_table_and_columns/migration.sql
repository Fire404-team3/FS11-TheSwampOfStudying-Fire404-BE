/*
  Warnings:

  - You are about to drop the column `endDate` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the column `habitName` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the column `isChecked` on the `HabitRecord` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Study` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Habit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `Study` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Study" DROP CONSTRAINT "Study_userId_fkey";

-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "endDate",
DROP COLUMN "habitName",
DROP COLUMN "startDate",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "HabitRecord" DROP COLUMN "isChecked";

-- AlterTable
ALTER TABLE "Study" DROP COLUMN "userId",
ADD COLUMN     "nickname" TEXT NOT NULL,
ALTER COLUMN "points" SET DEFAULT 0;

-- DropTable
DROP TABLE "User";
