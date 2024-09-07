-- DropForeignKey
ALTER TABLE "Sticker" DROP CONSTRAINT "Sticker_collectionId_fkey";

-- AddForeignKey
ALTER TABLE "Sticker" ADD CONSTRAINT "Sticker_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
