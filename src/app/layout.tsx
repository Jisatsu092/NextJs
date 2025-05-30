"use client";

import "@/css/satoshi.css";
import "@/css/style.css";
import { Sidebar } from "@/components/Layouts/sidebar";
import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";
import { Header } from "@/components/Layouts/header";
import NextTopLoader from "nextjs-toploader";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const userStr = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");

    if (!userStr || !accessToken) {
      if (pathname !== "/auth/sign-in" && pathname !== "/auth/sign-up") {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        router.push("/auth/sign-in");
      }
    }
  }, [pathname, router]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
              <Header />
              <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}