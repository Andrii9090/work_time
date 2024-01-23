/*
  Warnings:

  - You are about to alter the column `start` on the `workTime` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `finish` on the `workTime` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "workTime" ALTER COLUMN "start" SET DATA TYPE INTEGER,
ALTER COLUMN "finish" SET DATA TYPE INTEGER;
