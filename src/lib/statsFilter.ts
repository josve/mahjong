import {GameWithHands} from "@/types/db";
import {PeriodType} from "@/types/components";

export function filterGames(games: GameWithHands[], period: PeriodType) : GameWithHands[] {
    if (period === "all") {
        return games;
    }

    if (period === "new") {
        // Filter matches for "New period"
        return games.filter((match: GameWithHands) => {
            const matchDate = new Date(match.TIME);
            const newPeriodStartDate = new Date(2014, 10, 1);
            return matchDate >= newPeriodStartDate;
        })!;
    }

    if (period === "year") {
        // Filter matches for "Current year"
        return games.filter((match: GameWithHands) => {
            const matchDate = new Date(match.TIME);
            const currentYearStartDate = new Date(new Date().getFullYear(), 0, 1);
            return matchDate >= currentYearStartDate;
        })!;
    }

    throw new Error("Okänd period");
}