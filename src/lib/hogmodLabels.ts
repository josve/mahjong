export function getHogmodLabel(streakLength: number): string {
    if (streakLength >= 7) return "Odödlig";
    if (streakLength >= 6) return "Gudomlig";
    if (streakLength >= 5) return "Kejsare";
    if (streakLength >= 4) return "Tyrann";
    if (streakLength >= 3) return "Storhetsvansinne";
    return "Högmod";
}
