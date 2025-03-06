/*
  Warnings:

  - You are about to drop the column `roomId` on the `CanvasBoard` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `CanvasBoard` table. All the data in the column will be lost.
  - Added the required column `roomName` to the `CanvasBoard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `CanvasBoard` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CanvasBoard" DROP CONSTRAINT "CanvasBoard_roomId_fkey";

-- DropForeignKey
ALTER TABLE "CanvasBoard" DROP CONSTRAINT "CanvasBoard_userId_fkey";

-- AlterTable
ALTER TABLE "CanvasBoard" DROP COLUMN "roomId",
DROP COLUMN "userId",
ADD COLUMN     "roomName" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CanvasBoard" ADD CONSTRAINT "CanvasBoard_roomName_fkey" FOREIGN KEY ("roomName") REFERENCES "Room"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvasBoard" ADD CONSTRAINT "CanvasBoard_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
