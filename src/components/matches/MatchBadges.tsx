import React from "react";
import { Box, Chip, ChipProps } from "@mui/material";
import { LocalFireDepartment } from "@mui/icons-material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SouthIcon from '@mui/icons-material/South';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import BoltIcon from '@mui/icons-material/Bolt';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import UndoIcon from '@mui/icons-material/Undo';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import CastleIcon from '@mui/icons-material/Castle';
import { GameWithHands } from "@/types/db";
import { getMatchStats, isActiveMatch, MatchRecords, MatchStats } from "@/lib/matchRecords";

const LIMIT_HAND = 300;
/** How far behind the leader the eventual winner must have been to count as a comeback. */
const COMEBACK_DEFICIT = 500;
/** Final margins below this between the winner and the runner-up make a thriller. */
const THRILLER_MARGIN = 20;
/** Shortest east streak that counts as Högmod, and so the shortest one that can be a record. */
const HOGMOD_STREAK = 2;

interface BadgeContext {
    readonly stats: MatchStats | null;
    readonly records: MatchRecords;
}

export interface MatchBadgeDefinition {
    readonly id: string;
    readonly label: string;
    readonly color: ChipProps["color"];
    readonly icon: React.ReactElement;
    readonly applies: (match: GameWithHands, context: BadgeContext) => boolean;
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
        applies: (match) => isActiveMatch(match),
    },
    {
        id: "highest-score",
        label: "Högsta poäng",
        color: "success",
        icon: <EmojiEventsIcon />,
        applies: (_, { stats, records }) => !!stats && stats.highestScore === records.highestScore,
    },
    {
        id: "lowest-score",
        label: "Lägsta poäng",
        color: "warning",
        icon: <SouthIcon />,
        applies: (_, { stats, records }) => !!stats && stats.lowestScore === records.lowestScore,
    },
    {
        id: "biggest-win",
        label: "Största vinst",
        color: "success",
        icon: <TrendingUpIcon />,
        applies: (_, { stats, records }) => !!stats && stats.biggestWin === records.biggestWin,
    },
    {
        id: "biggest-loss",
        label: "Största förlust",
        color: "warning",
        icon: <TrendingDownIcon />,
        applies: (_, { stats, records }) => !!stats && stats.biggestLoss === records.biggestLoss,
    },
    {
        id: "shortest-match",
        label: "Kortast match",
        color: "info",
        icon: <BoltIcon />,
        applies: (match, { stats, records }) =>
            !!stats && !isActiveMatch(match) && stats.rounds === records.fewestRounds,
    },
    {
        id: "longest-match",
        label: "Längst match",
        color: "info",
        icon: <HourglassBottomIcon />,
        applies: (_, { stats, records }) => !!stats && stats.rounds === records.mostRounds,
    },
    {
        id: "comeback",
        label: "Comeback",
        color: "success",
        icon: <UndoIcon />,
        applies: (match, { stats }) =>
            !!stats && !isActiveMatch(match) && stats.winnerMaxDeficit >= COMEBACK_DEFICIT,
    },
    {
        id: "thriller",
        label: "Rysare",
        color: "secondary",
        icon: <SportsScoreIcon />,
        applies: (match, { stats }) =>
            !!stats && !isActiveMatch(match) && stats.finalMargin < THRILLER_MARGIN,
    },
    {
        id: "hogmod-record",
        label: "Högmodsrekord",
        color: "warning",
        icon: <CastleIcon />,
        applies: (_, { stats, records }) =>
            !!stats && stats.longestEastStreak >= HOGMOD_STREAK
            && stats.longestEastStreak === records.longestEastStreak,
    },
];

interface Props {
    readonly match: GameWithHands;
    readonly records: MatchRecords;
}

export default function MatchBadges({ match, records }: Props) {
    const context: BadgeContext = { stats: getMatchStats(match), records };
    const badges = MATCH_BADGES.filter(badge => badge.applies(match, context));

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
