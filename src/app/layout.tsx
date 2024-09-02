import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mahjong Master System 4.0",
  description: "The fantastic mahjong master system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <center>
          <div
            style={{
              maxWidth: "980px",
              minWidth: "600px",
              top: "20px",
              position: "relative",
            }}
          >
            <Header />
            {children}
          </div>
        </center>
      </body>
    </html>
  );
}
