import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NavBar } from "@/components/molecules/NavBar/NavBar";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./globals.css";
import "./tailwind-built.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TTRPG Dungeon Planner",
  description: "A tool for planning your TTRPG dungeons",
};

const navBarLinks = [
  {
    title: "Monsters",
    url: "/monsters",
  },
  {
    title: "Traps",
    url: "/traps",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <NavBar links={navBarLinks} />
          <>{children}</>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
        </Providers>
      </body>
    </html>
  );
}
