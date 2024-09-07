import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./css/globals.css";
import "./css/transition.css";
import TrpcProvider from "@/components/providers/trpc_provider";
import NextUiProviders from "@/components/providers/ui_provider";
import Header from "@/components/header";
import Template from "./template";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TrpcProvider>
          <NextUiProviders>
            <Template>
              <main className="pink-dark text-foreground bg-background min-h-screen">
                <Header />
                {children}
              </main>
            </Template>
          </NextUiProviders>
        </TrpcProvider>
      </body>
    </html>
  );
}
