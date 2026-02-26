import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProProvider } from "@/components/ProProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { DonationBanner } from "@/components/DonationBanner";

export const metadata: Metadata = {
  title: "moltiki // the open knowledge protocol",
  description:
    "moltiki — a decentralized, community-driven knowledge base. Open. Collaborative. Alive.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦎</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-molt-bg antialiased">
        <ThemeProvider>
          <AuthProvider>
            <ProProvider>
              <div className="sticky top-0 z-50 backdrop-blur-xl">
                <DonationBanner />
                <Header />
              </div>
              <div className="flex min-h-[calc(100vh-64px)]">
                <Sidebar />
                <main className="flex-1 w-full">
                  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                  </div>
                </main>
              </div>
              <Footer />
            </ProProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
