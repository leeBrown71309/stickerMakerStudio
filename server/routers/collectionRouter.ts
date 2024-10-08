/**
 * Ce fichier contient la définition du routeur des collection
 *
 * @packageDocumentation
 */
import { z } from "zod";
import { procedure, router } from "../trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const collectionRouter = router({
  getCollections: procedure
    .input(z.string())
    .query(async ({ input: userId }) => {
      const collections = await prisma.collection.findMany({
        where: { userId: userId },
        orderBy: { createdAt: "asc" },
        include: {
          user: true,
          stickers: true,
        },
      });
      return collections;
    }),

  getCollectionById: procedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const collection = await prisma.collection.findUnique({
          where: {
            id: input.id,
            userId: input.userId,
          },
          include: {
            user: true,
            stickers: true,
          },
        });
        return collection;
      } catch (error) {}
    }),

  addCollection: procedure
    .input(
      z.object({
        name: z.string(),
        tag: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const collection = await prisma.collection.create({
          data: {
            name: input.name,
            tag: input.tag,
            userId: input.userId,
          },
        });
        return collection;
      } catch (error) {}
    }),

  updateCollection: procedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
        name: z.string(),
        tag: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const updatedCollection = await prisma.collection.update({
          data: {
            name: input.name,
            tag: input.tag,
            userId: input.userId,
          },
          where: {
            id: input.id,
            userId: input.userId,
          },
        });
        return updatedCollection;
      } catch (error) {}
    }),

  deleteCollection: procedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await prisma.collection.delete({
          where: {
            id: input.id,
            userId: input.userId,
          },
        });
        return response;
      } catch (error) {}
    }),
});
