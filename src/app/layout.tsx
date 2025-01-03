import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { Container, Box } from "@mui/material";
import Providers from "@/components/Providers";

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
        <body>
        <Providers>
            <Header/>
            <Container className="content-container">
                <Box
                    sx={{
                        paddingTop: "70px",
                        minHeight: "calc(100vh + 100px)",
                        paddingBottom: "70px",
                        zIndex: -1000,
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
            <Footer/>
        </Providers>
        </body>
        </html>
    );
}
