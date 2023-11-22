/*
  Warnings:

  - You are about to drop the column `friend_id` on the `Event_Attendance` table. All the data in the column will be lost.
  - Added the required column `attende_id` to the `Event_Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ExpiredJwt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Event_Attendance` DROP FOREIGN KEY `Event_Attendance_friend_id_fkey`;

-- AlterTable
ALTER TABLE `Event_Attendance` DROP COLUMN `friend_id`,
    ADD COLUMN `attende_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ExpiredJwt` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `Event_Attendance` ADD CONSTRAINT `Event_Attendance_attende_id_fkey` FOREIGN KEY (`attende_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
