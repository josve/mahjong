// components/FooterClient.tsx

"use client";

import React from "react";
import {
    BottomNavigation,
    BottomNavigationAction,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Link from "next/link";
import { Session } from "next-auth";
import { getNavigationItems, NavigationItem } from "@/lib/navigationItems";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {MoreHoriz} from "@mui/icons-material";

interface Props {
    readonly session: Session | null;
}

export default function FooterClient({ session }: Props) {
    const [value, setValue] = React.useState(0);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMoreClose = () => {
        setAnchorEl(null);
    };

    const navigationItems: NavigationItem[] = getNavigationItems(session);

    // Filter items to include both authenticated and guest links
    const visibleItems = navigationItems.filter((item) =>
        item.auth === "both" ||
        (item.auth === "authenticated" && session?.user) ||
        (item.auth === "guest" && !session?.user)
    );

    // Determine items to show directly and items to move to "More"
    const directItems = visibleItems.slice(0, 3);
    const moreItems = visibleItems.slice(3);

    return (
        <>
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
                    {/* Render the first three navigation items */}
                    {directItems.map((item, index) => (
                        <BottomNavigationAction
                            key={item.label}
                            label={item.label}
                            icon={<item.icon/>}
                            component={Link}
                            href={item.href}
                        />
                    ))}

                    {/* If there are more items, add the "More" action */}
                    {moreItems.length > 0 && (
                        <>
                            <BottomNavigationAction
                                label="More"
                                icon={<MoreHoriz />}
                                onClick={handleMoreClick}
                            />
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleMoreClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                            >
                                {moreItems.map((item) => (
                                    <MenuItem
                                        key={item.label}
                                        component={Link}
                                        href={item.href}
                                        onClick={handleMoreClose}
                                    >
                                        {item.icon && (
                                            <ListItemIcon>
                                                {<item.icon/>}
                                            </ListItemIcon>
                                        )}
                                        <ListItemText primary={item.label} />
                                    </MenuItem>
                                ))}
                            </Menu>
                        </>
                    )}
                </BottomNavigation>
            </Paper>
        </>
    );
}