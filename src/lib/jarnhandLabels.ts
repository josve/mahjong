export function getJarnhandLabel(streakLength: number): string {
    if (streakLength >= 8) return "Orubblig";
    if (streakLength >= 7) return "Osårbar";
    if (streakLength >= 6) return "Okuvlig";
    if (streakLength >= 5) return "Befäst";
    if (streakLength >= 4) return "Ståndaktig";
    return "Järnhand";
}
