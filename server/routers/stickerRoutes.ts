/**
 * Ce fichier contient la définition du routeur des collection
 *
 * @packageDocumentation
 */
import { z } from "zod";
import { procedure, router } from "../trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const stickerRouter = router({
  getStickers: procedure
    .input(z.string())
    .query(async ({ input: collectionId }) => {
      const stickers = await prisma.sticker.findMany({
        where: { collectionId: collectionId },
        orderBy: { createdAt: "asc" },
        include: {
          collection: true,
        },
      });
      return stickers;
    }),

  addSticker: procedure
    .input(
      z.object({
        name: z.string(),
        imageUrl: z.string(),
        collectionId: z.string().uuid(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const sticker = await prisma.sticker.create({
          data: {
            name: input.name,
            imageUrl: input.imageUrl,
            collectionId: input.collectionId,
          },
        });
        return sticker;
      } catch (error) {}
    }),

  updateSticker: procedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        imageUrl: z.string(),
        collectionId: z.string().uuid(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const sticker = await prisma.sticker.update({
          data: {
            name: input.name,
            imageUrl: input.imageUrl,
            collectionId: input.collectionId,
          },
          where: {
            id: input.id,
          },
        });
        return sticker;
      } catch (error) {}
    }),

  deleteSticker: procedure
    .input(
      z.object({
        id: z.string(),
        collectionId: z.string().uuid(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const sticker = await prisma.sticker.delete({
          where: {
            id: input.id,
            collectionId: input.collectionId,
          },
        });
        return sticker;
      } catch (error) {}
    }),
});
