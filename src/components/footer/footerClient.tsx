// components/FooterClient.tsx

"use client";

import React from "react";
import {
    BottomNavigation,
    BottomNavigationAction,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Link from "next/link";
import { Session } from "next-auth";
import { getNavigationItems, NavigationItem } from "@/lib/navigationItems";

interface Props {
    readonly session: Session | null;
}

export default function FooterClient({ session }: Props) {
    const [value, setValue] = React.useState(0);
    const navigationItems: NavigationItem[] = getNavigationItems(session);

    // Filter items to include both authenticated and guest links
    const visibleItems = navigationItems.filter((item) =>
        item.auth === "both" ||
        (item.auth === "authenticated" && session?.user) ||
        (item.auth === "guest" && !session?.user)
    );

    return (
        <Paper
            sx={{
                display: { xs: "block", md: "none" },
                paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))",
                zIndex: "9000",
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
            }}
            elevation={3}
        >
            <BottomNavigation
                showLabels
                value={value}
                onChange={(ignore, newValue: number) => {
                    setValue(newValue);
                }}
                className="footer"
            >
                {visibleItems.map((item, index) => (
                    <BottomNavigationAction
                        key={item.label}
                        label={item.label}
                        icon={<item.icon/>}
                        component={Link}
                        href={item.href}
                    />
                ))}
            </BottomNavigation>
        </Paper>
    );
}