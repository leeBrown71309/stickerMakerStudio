/**
 * Ce fichier définit la route /api/trpc qui est le endpoint de l'API TRPC.
 *
 * Il utilise l'adapter fetch pour servir l'API.
 *
 * @packageDocumentation
 */
import { appRouter } from "@/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = async (req: Request) => {
  try {
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      router: appRouter,
      req,
      createContext: () => ({}),
    });
    return response;
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};

export { handler as GET, handler as POST };
