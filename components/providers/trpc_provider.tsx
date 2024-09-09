"use client";
import { trpc } from "@/server/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";

export default function TrpcProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const apiurls = {
    devUrl: "http://localhost:3000/api/trpc",
    prodUrl:
      "https://sticker-maker-studio-ekjb2tv5n-leebrowns-projects.vercel.app/api/trpc",
  };
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: apiurls.prodUrl,
          transformer: superjson,
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
