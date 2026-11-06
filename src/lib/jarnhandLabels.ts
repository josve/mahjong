import type {HandBadgeLabelKey} from "@/components/match/HandBadges";

/** The message key (in the handBadges namespace) for a Järnhand streak of the given length. */
export function getJarnhandLabel(streakLength: number): HandBadgeLabelKey {
    if (streakLength >= 8) return "orubblig";
    if (streakLength >= 7) return "osarbar";
    if (streakLength >= 6) return "okuvlig";
    if (streakLength >= 5) return "befast";
    if (streakLength >= 4) return "standaktig";
    return "jarnhand";
}
