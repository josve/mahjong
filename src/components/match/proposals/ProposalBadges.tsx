import React from "react";
import {Box, Chip} from "@mui/material";
import {BadgeInfo} from "./playerResultData";

interface Props {
    readonly badges: readonly BadgeInfo[];
    readonly justify?: "flex-start" | "flex-end" | "center";
    readonly mt?: number;
}

/** The hand badges as chips, the same way HandBadges shows them in the current widget. */
export default function ProposalBadges({badges, justify = "flex-end", mt = 1}: Props) {
    if (badges.length === 0) {
        return null;
    }
    return (
        <Box sx={{display: "flex", flexWrap: "wrap", justifyContent: justify, gap: 0.5, mt}}>
            {badges.map(badge => (
                <Chip key={badge.id} label={badge.label} color={badge.color} size="small" icon={badge.icon}/>
            ))}
        </Box>
    );
}
