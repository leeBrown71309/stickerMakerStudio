/**
 * Ce fichier contient la définition du routeur des utilisateurs
 *
 * @packageDocumentation
 */
import { z } from "zod";
import { procedure, router } from "../trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const userRouter = router({
  getUser: procedure.input(z.string()).query(async ({ input: id }) => {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  }),

  getUserByEmail: procedure
    .input(z.string())
    .mutation(async ({ input: email }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      return user;
    }),

  addUser: procedure
    .input(
      z.object({
        fullname: z.string(),
        email: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.user.create({
        data: {
          fullname: input.fullname,
          email: input.email,
        },
      });
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });
      return user;
    }),
});
