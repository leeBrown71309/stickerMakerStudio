/**
 * Ce fichier contient la définition de l'objet `appRouter` qui est le routeur
 * principal de l'application.
 *
 * @packageDocumentation
 */
import { router } from "./trpc";
import { userRouter } from "./routers/userRoutes";
import { collectionRouter } from "./routers/collectionRouter";
import { stickerRouter } from "./routers/stickerRoutes";

export const appRouter = router({
  user: userRouter,
  collection: collectionRouter,
  sticker: stickerRouter,
});

export type AppRouter = typeof appRouter;
