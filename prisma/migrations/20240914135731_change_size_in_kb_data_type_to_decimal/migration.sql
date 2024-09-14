/*
  Warnings:

  - You are about to alter the column `sizeInKB` on the `File` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "File" ALTER COLUMN "sizeInKB" SET DATA TYPE DECIMAL(65,30);
