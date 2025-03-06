/*
  Warnings:

  - You are about to drop the `CanvasBoard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CanvasBoard" DROP CONSTRAINT "CanvasBoard_roomName_fkey";

-- DropForeignKey
ALTER TABLE "CanvasBoard" DROP CONSTRAINT "CanvasBoard_username_fkey";

-- DropTable
DROP TABLE "CanvasBoard";

-- CreateTable
CREATE TABLE "CanvasDrawing" (
    "id" SERIAL NOT NULL,
    "roomName" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "CanvasDrawing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CanvasDrawing" ADD CONSTRAINT "CanvasDrawing_roomName_fkey" FOREIGN KEY ("roomName") REFERENCES "Room"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvasDrawing" ADD CONSTRAINT "CanvasDrawing_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
