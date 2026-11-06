import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Providers from "@/components/Providers";
import {NextIntlClientProvider} from "next-intl";
import {getLocale, getTranslations} from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("app");
    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const locale = await getLocale();

    return (
        <html lang={locale}>
        <body>
        <NextIntlClientProvider>
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
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
