import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import "../app/globals.css"
import "../../app/globals.css"
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import Footer from "./footer/page";
import Providers from "@/components/providers";
import ReduxProvider from "@/components/redux-provider";
import { ThemeProvider } from "next-themes";
import MainHeader from "@/components/main-header";
import Consent from "@/components/cookie";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auth layout",
  description: "E-commerce Application",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = await cookies();
  const defaultOpen = cookie.get("sidebar_state")?.value === "true"
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
      >
        <Providers>
          <ReduxProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                <div className="w-full mt-5 bg-acent">
                  <div className="flex justify-center items-center">
                    <MainHeader />
                  </div>
                  <div className="min-h-[75vh] mt-11 p-2 mx-auto md:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
                    {children}
                    <Consent />
                    </div>
                  <Footer />
                </div>
                <Toaster />
              </ThemeProvider>
            <Toaster position="top-center" />
          </ReduxProvider>
        </Providers>

      </body>
    </html>
  );
}
