import type {HandBadgeLabelKey} from "@/components/match/HandBadges";

/** The message key (in the handBadges namespace) for a Storvinnare streak of the given length. */
export function getStorvinnareLabel(streakLength: number): HandBadgeLabelKey {
    if (streakLength >= 7) return "oovervinnlig";
    if (streakLength >= 6) return "dominant";
    if (streakLength >= 5) return "mastare";
    if (streakLength >= 4) return "champion";
    if (streakLength >= 3) return "segrare";
    return "storvinnare";
}
