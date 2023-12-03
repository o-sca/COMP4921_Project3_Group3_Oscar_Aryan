/*
  Warnings:

  - The `deleted` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `Event` MODIFY `color` VARCHAR(191) NOT NULL DEFAULT '#3788d8',
    DROP COLUMN `deleted`,
    ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;
