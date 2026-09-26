import React from "react";
import { Box, Chip, ChipProps } from "@mui/material";
import { LocalFireDepartment } from "@mui/icons-material";
import CastleIcon from '@mui/icons-material/Castle';
import { Hand } from "@/types/db";
import { Round } from "@/components/match/matchChartClient";
import { getHogmodLabel } from "@/lib/hogmodLabels";

const LIMIT_HAND = 300;
const HIGHROLLER_HAND = 100;
const HOGMOD_STREAK = 2;

/**
 * Everything a badge may need to decide whether it applies to a hand.
 */
export interface HandBadgeContext {
    readonly hand: Hand;
    readonly round: Round;
    readonly eastStreak: number;
}

export interface HandBadgeDefinition {
    readonly id: string;
    readonly label: string | ((context: HandBadgeContext) => string);
    readonly color: ChipProps["color"];
    readonly icon: React.ReactElement;
    readonly applies: (context: HandBadgeContext) => boolean;
}

const isHighroller = ({ hand }: HandBadgeContext) => hand.HAND >= HIGHROLLER_HAND;

const isBestHand = (context: HandBadgeContext) =>
    !isHighroller(context) && context.hand.HAND == context.round.maxHand;

/**
 * All badges that can be shown for a player's hand in a round, in display order.
 * To add a new badge, append a definition here.
 */
export const HAND_BADGES: readonly HandBadgeDefinition[] = [
    {
        id: "limit-hand",
        label: "Limit hand",
        color: "error",
        icon: <LocalFireDepartment />,
        applies: ({ hand }) => hand.HAND === LIMIT_HAND,
    },
    {
        id: "highroller",
        label: "Highroller",
        color: "secondary",
        icon: <LocalFireDepartment />,
        applies: (context) => isHighroller(context) && context.hand.HAND !== LIMIT_HAND,
    },
    {
        id: "best-hand",
        label: "Bästa hand",
        color: "primary",
        icon: <LocalFireDepartment />,
        applies: isBestHand,
    },
    {
        id: "best-score",
        label: "Störst vinst",
        color: "primary",
        icon: <LocalFireDepartment />,
        applies: (context) =>
            !isHighroller(context) && !isBestHand(context)
            && context.hand.HAND_SCORE == context.round.maxScore,
    },
    {
        id: "hogmod",
        label: ({ eastStreak }) => getHogmodLabel(eastStreak),
        color: "warning",
        icon: <CastleIcon />,
        applies: ({ eastStreak }) => eastStreak >= HOGMOD_STREAK,
    },
];

interface Props {
    readonly hand: Hand;
    readonly round: Round;
}

export default function HandBadges({ hand, round }: Props) {
    const context: HandBadgeContext = {
        hand,
        round,
        eastStreak: round.eastStreaks?.[hand.TEAM_ID] || 0,
    };
    const badges = HAND_BADGES.filter(badge => badge.applies(context));

    if (badges.length === 0) {
        return null;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                gap: 0.5,
                mt: 1,
            }}>
            {badges.map(badge => (
                <Chip
                    key={badge.id}
                    label={typeof badge.label === "function" ? badge.label(context) : badge.label}
                    color={badge.color}
                    size="small"
                    icon={badge.icon}
                />
            ))}
        </Box>
    );
}
