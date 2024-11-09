import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
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
    <Header/>
    <Container className="content-container">
        <Box
            sx={{
                margin: "0 auto",
                backgroundColor: "var(--white)",
            }}
        >
            <Box 
      sx={{
        margin: "20px"
      }}
          >
            {children}
          </Box>
          </Box>
        </Container>
        <Footer />
      </body>
    </html>
  );
}
