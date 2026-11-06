import type {HandBadgeLabelKey} from "@/components/match/HandBadges";

/** The message key (in the handBadges namespace) for a Högmod streak of the given length. */
export function getHogmodLabel(streakLength: number): HandBadgeLabelKey {
    if (streakLength >= 7) return "ododlig";
    if (streakLength >= 6) return "gudomlig";
    if (streakLength >= 5) return "kejsare";
    if (streakLength >= 4) return "tyrann";
    if (streakLength >= 3) return "storhetsvansinne";
    return "hogmod";
}
