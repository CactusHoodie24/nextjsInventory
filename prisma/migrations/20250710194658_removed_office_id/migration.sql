/*
  Warnings:

  - You are about to drop the column `officeId` on the `Request` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_officeId_fkey";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "officeId";
