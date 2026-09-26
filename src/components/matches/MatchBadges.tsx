import React from "react";
import { Box, Chip, ChipProps } from "@mui/material";
import { LocalFireDepartment } from "@mui/icons-material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { GameWithHands } from "@/types/db";

const ACTIVE_MATCH_WINDOW_MS = 24 * 60 * 60 * 1000;
const LIMIT_HAND = 300;

export interface MatchBadgeDefinition {
    readonly id: string;
    readonly label: string;
    readonly color: ChipProps["color"];
    readonly icon: React.ReactElement;
    readonly applies: (match: GameWithHands) => boolean;
}

/**
 * All badges that can be shown on a match card, in display order.
 * To add a new badge, append a definition here.
 */
export const MATCH_BADGES: readonly MatchBadgeDefinition[] = [
    {
        id: "limit-hand",
        label: "Limit hand",
        color: "error",
        icon: <LocalFireDepartment />,
        applies: (match) => match.hands.some(hand => hand.HAND === LIMIT_HAND),
    },
    {
        id: "active",
        label: "Aktiv match",
        color: "primary",
        icon: <NotificationsIcon />,
        applies: (match) => Date.now() - match.TIME.getTime() < ACTIVE_MATCH_WINDOW_MS,
    },
];

interface Props {
    readonly match: GameWithHands;
}

export default function MatchBadges({ match }: Props) {
    const badges = MATCH_BADGES.filter(badge => badge.applies(match));

    if (badges.length === 0) {
        return null;
    }

    return (
        <Box
            sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                gap: 1,
            }}>
            {badges.map(badge => (
                <Chip
                    key={badge.id}
                    label={badge.label}
                    color={badge.color}
                    size="small"
                    icon={badge.icon}
                />
            ))}
        </Box>
    );
}
