import React from "react";
import { Box, Chip, ChipProps } from "@mui/material";
import { LocalFireDepartment } from "@mui/icons-material";
import CastleIcon from '@mui/icons-material/Castle';
import MasksIcon from '@mui/icons-material/Masks';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import CelebrationIcon from '@mui/icons-material/Celebration';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ShieldIcon from '@mui/icons-material/Shield';
import { Hand } from "@/types/db";
import { Round } from "@/lib/rounds";
import { getHogmodLabel } from "@/lib/hogmodLabels";
import { getStorvinnareLabel } from "@/lib/storvinnareLabels";
import { getJarnhandLabel } from "@/lib/jarnhandLabels";

const LIMIT_HAND = 300;
const HIGHROLLER_HAND = 100;
const HOGMOD_STREAK = 2;
const STORVINNARE_STREAK = 2;
const JARNHAND_STREAK = 3;
/** How many rounds a team must have gone without a win for its next win to count as Äntligen. */
const ANTLIGEN_WINLESS = 3;
/** The previous round's biggest loss must be larger than this for a win to count as Revansch. */
const REVANSCH_LOSS = 100;

/**
 * Everything a badge may need to decide whether it applies to a hand.
 */
export interface HandBadgeContext {
    readonly hand: Hand;
    readonly round: Round;
    readonly eastStreak: number;
    readonly winStreak: number;
    readonly positiveStreak: number;
}

export interface HandBadgeDefinition {
    readonly id: string;
    readonly label: string | ((context: HandBadgeContext) => string);
    readonly color: ChipProps["color"];
    readonly icon: React.ReactElement;
    readonly applies: (context: HandBadgeContext) => boolean;
    /** For streak badges: how many rounds long the streak is. */
    readonly streak?: (context: HandBadgeContext) => number;
}

const isHighroller = ({ hand }: HandBadgeContext) => hand.HAND >= HIGHROLLER_HAND;

/**
 * The team did not win the round but still gained more points than the winner.
 */
const isSmygvinst = ({ hand, round }: HandBadgeContext) => {
    if (hand.IS_WINNER || hand.HAND_SCORE <= 0) {
        return false;
    }
    const winner = round.hands.find(other => other.IS_WINNER);
    return !!winner && hand.HAND_SCORE > winner.HAND_SCORE;
};

/**
 * The team won after having gone several rounds in a row without a win.
 */
const isAntligen = ({ hand, round }: HandBadgeContext) =>
    !!hand.IS_WINNER && (round.previousWinlessStreaks?.[hand.TEAM_ID] || 0) >= ANTLIGEN_WINLESS;

/**
 * The team won right after taking the biggest loss of the previous round, and it was a big one.
 */
const isRevansch = ({ hand, round }: HandBadgeContext) => {
    if (!hand.IS_WINNER || !round.previousHand) {
        return false;
    }
    const previous = round.previousHand.find(prev => prev.TEAM_ID === hand.TEAM_ID);
    return !!previous && -previous.HAND_SCORE > REVANSCH_LOSS
        && previous.HAND_SCORE === Math.min(...round.previousHand.map(other => other.HAND_SCORE));
};

/** The team strictly ahead of all others, or undefined when the top is shared. */
const soleLeader = (totals: { [teamId: string]: number }) => {
    const ranked = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    return ranked.length > 1 && ranked[0][1] > ranked[1][1] ? ranked[0][0] : undefined;
};

/** The team strictly behind all others, or undefined when the bottom is shared. */
const soleLast = (totals: { [teamId: string]: number }) => {
    const ranked = Object.entries(totals).sort((a, b) => a[1] - b[1]);
    return ranked.length > 1 && ranked[0][1] < ranked[1][1] ? ranked[0][0] : undefined;
};

/**
 * The team took the lead from another team that was leading before the round.
 */
const isTronskifte = ({ hand, round }: HandBadgeContext) => {
    if (!round.previousTotals || !round.totals) {
        return false;
    }
    const previousLeader = soleLeader(round.previousTotals);
    return !!previousLeader && previousLeader !== hand.TEAM_ID && soleLeader(round.totals) === hand.TEAM_ID;
};

/**
 * The team went from sole last to sole leader in a single round.
 */
const isRaketen = ({ hand, round }: HandBadgeContext) =>
    !!round.previousTotals && !!round.totals
    && soleLast(round.previousTotals) === hand.TEAM_ID
    && soleLeader(round.totals) === hand.TEAM_ID;

/**
 * The team's total climbed from below zero back to zero or above in this round.
 */
const isAteruppstandelse = ({ hand, round }: HandBadgeContext) => {
    const before = round.previousTotals?.[hand.TEAM_ID];
    const after = round.totals?.[hand.TEAM_ID];
    return before !== undefined && after !== undefined && before < 0 && after >= 0;
};

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
        streak: ({ eastStreak }) => eastStreak,
    },
    {
        id: "storvinnare",
        label: ({ winStreak }) => getStorvinnareLabel(winStreak),
        color: "success",
        icon: <EmojiEventsIcon />,
        applies: ({ winStreak }) => winStreak >= STORVINNARE_STREAK,
        streak: ({ winStreak }) => winStreak,
    },
    {
        id: "jarnhand",
        label: ({ positiveStreak }) => getJarnhandLabel(positiveStreak),
        color: "success",
        icon: <ShieldIcon />,
        applies: ({ positiveStreak }) => positiveStreak >= JARNHAND_STREAK,
        streak: ({ positiveStreak }) => positiveStreak,
    },
    {
        id: "smygvinst",
        label: "Smygvinst",
        color: "success",
        icon: <MasksIcon />,
        applies: isSmygvinst,
    },
    {
        id: "antligen",
        label: "Äntligen!",
        color: "success",
        icon: <CelebrationIcon />,
        applies: isAntligen,
    },
    {
        id: "revansch",
        label: "Revansch",
        color: "warning",
        icon: <SportsMmaIcon />,
        applies: isRevansch,
    },
    {
        id: "tronskifte",
        label: "Tronskifte",
        color: "warning",
        icon: <MilitaryTechIcon />,
        applies: isTronskifte,
    },
    {
        id: "raketen",
        label: "Raketen",
        color: "primary",
        icon: <RocketLaunchIcon />,
        applies: isRaketen,
    },
    {
        id: "ateruppstandelse",
        label: "Återuppståndelse",
        color: "warning",
        icon: <AutoAwesomeIcon />,
        applies: isAteruppstandelse,
    },
];

/** The badges a hand earned in a round, in display order. */
export function getHandBadges(hand: Hand, round: Round): HandBadgeDefinition[] {
    const context = createHandBadgeContext(hand, round);
    return HAND_BADGES.filter(badge => badge.applies(context));
}

export function createHandBadgeContext(hand: Hand, round: Round): HandBadgeContext {
    return {
        hand,
        round,
        eastStreak: round.eastStreaks?.[hand.TEAM_ID] || 0,
        winStreak: round.winStreaks?.[hand.TEAM_ID] || 0,
        positiveStreak: round.positiveStreaks?.[hand.TEAM_ID] || 0,
    };
}

interface Props {
    readonly hand: Hand;
    readonly round: Round;
}

export default function HandBadges({ hand, round }: Props) {
    const context = createHandBadgeContext(hand, round);
    const badges = getHandBadges(hand, round);

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
