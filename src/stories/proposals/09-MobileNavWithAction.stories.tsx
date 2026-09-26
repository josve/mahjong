import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import React from "react";
import {Box, Typography} from "@mui/material";
import MobileNavWithAction from "@/components/proposals/MobileNavWithAction";
import MatchCardV2 from "@/components/proposals/MatchCardV2";
import {activeCard, limitHandCard, oldCard} from "@/stories/proposals/data";

const content = (
    <Box sx={{p: 2, display: "grid", gap: 2}}>
        <Typography variant="h1" sx={{fontSize: 26}}>Matcher</Typography>
        <MatchCardV2 match={activeCard}/>
        <MatchCardV2 match={limitHandCard}/>
        <MatchCardV2 match={oldCard}/>
    </Box>
);

const meta = {
    title: "Förbättringsförslag/09 Mobilmeny med stor knapp",
    component: MobileNavWithAction,
    args: {children: content},
    argTypes: {children: {table: {disable: true}}},
} satisfies Meta<typeof MobileNavWithAction>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IngenMatch: Story = {};

export const PagaendeMatch: Story = {args: {activeMatch: activeCard.name}};
