/**
 * This file contains the basic exports for initializing a TRPC server.
 *
 * @packageDocumentation
 */
import { initTRPC } from "@trpc/server";
import superjson from "superjson";

const trpc = initTRPC.create({
  transformer: superjson,
});

export const router = trpc.router;
export const procedure = trpc.procedure;
