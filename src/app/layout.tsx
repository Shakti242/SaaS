import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/providers/theme-provider";

const font = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Fuzzie.',
  description: "Automate your work with Fuzzie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800">
            <div className="flex-1">
              {/* Add other header elements here if needed */}
            </div>
            <div className="flex-none">
              <img src="/path/to/your/logo.png" alt="Logo" className="h-8" />
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
