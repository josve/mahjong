import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { Container, Box } from "@mui/material";

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
        <Container>
          <Box
            sx={{
              maxWidth: "980px",
              minWidth: "600px",
              paddingTop: "20px",
              margin: "0 auto",
            }}
          >
            <Header />
            {children}
          </Box>
        </Container>
      </body>
    </html>
  );
}
