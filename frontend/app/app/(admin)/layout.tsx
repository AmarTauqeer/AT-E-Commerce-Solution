
import AppSidebar from '@/components/admin/app-sidebar'
import Navbar from '@/components/admin/Navbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Geist, Geist_Mono } from 'next/font/google'
import { cookies } from 'next/headers'
import React from 'react'
import "../../app/globals.css"
import { Toaster } from 'sonner'
import Providers from '@/components/providers'
import ReduxProvider from '@/components/redux-provider'
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

type Props = {
  children?: React.ReactNode
}

const Adminlayout = async ({ children }: Props) => {
  const cookie = await cookies();
  const defaultOpen = cookie.get("sidebar_state")?.value === "true"
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
      >
        <Providers>
          <ReduxProvider>


            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar />
                <main className="w-full">
                  <Navbar />
                  <><div className="p-6">{children}</div></>
                </main>
              </SidebarProvider>
              <Toaster position="top-center" />
            </ThemeProvider>
          </ReduxProvider>
        </Providers>
      </body>
    </html>
  )
}

export default Adminlayout
