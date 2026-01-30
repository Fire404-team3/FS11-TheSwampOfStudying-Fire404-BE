/*
  Warnings:

  - A unique constraint covering the columns `[studyId,emojiType]` on the table `EmojiLog` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Habit" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "EmojiLog_studyId_emojiType_key" ON "EmojiLog"("studyId", "emojiType");
