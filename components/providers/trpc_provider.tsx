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
  function getBaseUrl() {
    if (typeof window !== "undefined")
      // browser should use relative path
      return "";
    // if (process.env.VERCEL_URL)
    //   // reference for vercel.com
    //   return `https://${process.env.VERCEL_URL}`;
    // if (process.env.RENDER_INTERNAL_HOSTNAME)
    //   // reference for render.com
    //   return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
    // if (process.env.NETLIFY_SITE_URL)
    //   // reference for netlify.com
    //   return `${process.env.NETLIFY_SITE_URL}`;
    // assume localhost
    return `${process.env.API_URL}`;
  }

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
<<<<<<< HEAD
          url: apiurls.prodUrl,
=======
          url: `${getBaseUrl()}/api/trpc`,
>>>>>>> dev
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
