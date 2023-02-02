/*
  Warnings:

  - A unique constraint covering the columns `[web3Address]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `web3Address` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_web3Address_key` ON `User`(`web3Address`);
