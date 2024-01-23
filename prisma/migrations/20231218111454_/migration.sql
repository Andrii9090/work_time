/*
  Warnings:

  - You are about to alter the column `messageId` on the `workTime` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "workTime" ALTER COLUMN "messageId" DROP NOT NULL,
ALTER COLUMN "messageId" SET DATA TYPE INTEGER;
