// Mirrors src/app/layout.tsx (which renders <html>/<body> and can't be used in a story)
// so page stories are shown inside the real header, footer and content container.
import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import type {Session} from "next-auth";
import HeaderClient from "@/components/header/headerClient";
import FooterClient from "@/components/footer/footerClient";

interface Props {
    readonly session: Session | null;
    readonly children: React.ReactNode;
}

export default function AppLayout({session, children}: Props) {
    return (
        <>
            <HeaderClient session={session}/>
            <Container className="content-container">
                <Box
                    sx={{
                        paddingTop: "70px",
                        minHeight: "calc(100vh + 100px)",
                        paddingBottom: "70px",
                        margin: "0 auto",
                        backgroundColor: "var(--white)",
                    }}
                >
                    <Box sx={{margin: "20px"}}>
                        {children}
                    </Box>
                </Box>
            </Container>
            <FooterClient session={session}/>
        </>
    );
}
