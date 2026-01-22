/*
  Warnings:

  - A unique constraint covering the columns `[studyId,emojiType]` on the table `EmojiLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EmojiLog_studyId_emojiType_key" ON "EmojiLog"("studyId", "emojiType");
