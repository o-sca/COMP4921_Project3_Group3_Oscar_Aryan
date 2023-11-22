/*
  Warnings:

  - You are about to drop the column `attende_id` on the `Event_Attendance` table. All the data in the column will be lost.
  - Added the required column `user_attende_id` to the `Event_Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Event_Attendance` DROP FOREIGN KEY `Event_Attendance_attende_id_fkey`;

-- AlterTable
ALTER TABLE `Event_Attendance` DROP COLUMN `attende_id`,
    ADD COLUMN `user_attende_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Event_Attendance` ADD CONSTRAINT `Event_Attendance_user_attende_id_fkey` FOREIGN KEY (`user_attende_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
