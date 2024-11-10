"use client";

import React from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import Paper from '@mui/material/Paper';
import Link from "next/link";
import CasinoOutlinedIcon from '@mui/icons-material/CasinoOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import { Session } from 'next-auth';

export default function FooterClient({ session }: { readonly session: Session | null }) {
    const [value, setValue] = React.useState(0);

    return (
        <Paper sx={{
            display: {xs: "block", md: "none"},
            paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))",
            zIndex: "9000",
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0
        }} elevation={3}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(ignore, newValue: number) => {
                    setValue(newValue);
                }}
                className="footer"
            >
                <BottomNavigationAction
                    label="Matcher"
                    icon={<CasinoOutlinedIcon/>}
                    component={Link}
                    href="/"
                />
                <BottomNavigationAction
                    label="Statistik"
                    icon={<TrendingUpOutlinedIcon/>}
                    component={Link}
                    href="/statistics"
                />
                <BottomNavigationAction
                    label="Poängtabell"
                    icon={<TableChartOutlinedIcon/>}
                    component={Link}
                    href="/scoreboard"
                />
                <BottomNavigationAction
                    label="Poängräknare"
                    icon={<CalculateOutlinedIcon/>}
                    component={Link}
                    href="/scorecalculator"
                />
                {!session?.user &&
                    <BottomNavigationAction
                        label="Logga in"
                        icon={<LoginOutlinedIcon/>}
                        component={Link}
                        href="/api/auth/signin"
                    />
                }
                {session?.user && (
                    <BottomNavigationAction
                        label={session.user.name}
                        icon={<Person2OutlinedIcon/>}
                        component={Link}
                        href="/profile"
                    />
                )}
            </BottomNavigation>
        </Paper>
    );
}
