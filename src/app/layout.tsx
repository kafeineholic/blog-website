import type { Metadata } from "next";
import { Prompt, Geist_Mono } from "next/font/google";
import Providers from "@/app/providers";
import Header from "@/components/Header";
import "./globals.css";
import { Box } from "@mui/material";

const promptSans = Prompt({
  variable: "--font-prompt-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog System",
  description: "Mock API powered blog and admin system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="en"
      className={`${promptSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Header />
          <Box
            component="main"
            sx={{
              pt: { xs: "60px", lg: "84px" }, 
            }}
          >
          {children}
          </Box>
        </Providers>
      </body>
    </html>
  );
}
