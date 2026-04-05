export function getStorvinnareLabel(streakLength: number): string {
    if (streakLength >= 7) return "Oövervinnlig";
    if (streakLength >= 6) return "Dominant";
    if (streakLength >= 5) return "Mästare";
    if (streakLength >= 4) return "Champion";
    if (streakLength >= 3) return "Segrare";
    return "Storvinnare";
}
