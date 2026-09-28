import {GameWithHands, IdToColorMap, IdToName} from "@/types/db";
import {getMatchStats, isActiveMatch, MatchStats} from "@/lib/matchRecords";
import {capitalize, formatDate} from "@/lib/formatting";

const STARTING_SCORE = 500;
const LIMIT_HAND = 300;
const WIND_ORDER = ["E", "S", "W", "N"];

export interface ProposalProps {
    readonly match: GameWithHands;
    readonly index: number;
    readonly idToName: IdToName;
    /** Team colors, as returned by getTeamColors(). Optional so cards still render without them. */
    readonly colors?: IdToColorMap;
}

export interface RankedTeam {
    readonly teamId: string;
    readonly name: string;
    readonly score: number;
    /** Score relative to the starting score. */
    readonly delta: number;
    readonly rank: number;
    /** Score after every played round, starting with the starting score. */
    readonly history: number[];
    /** The team's current wind (E/S/W/N). */
    readonly wind: string;
    readonly color: string;
    readonly wins: number;
    readonly biggestHand: number;
}

export interface MatchCardData {
    readonly name: string;
    readonly dateLabel: string;
    readonly timeRange: string;
    readonly durationMinutes: number;
    readonly rounds: number;
    readonly active: boolean;
    readonly hasLimitHand: boolean;
    readonly teams: RankedTeam[];
    readonly stats: MatchStats | null;
    readonly biggestHand: { teamName: string, hand: number } | null;
}

const FALLBACK_COLORS = ["#e54646", "#3478c8", "#3caa5a", "#e6a028"];

function toCss(colors: IdToColorMap | undefined, teamId: string, fallbackIndex: number): string {
    const color = colors?.[teamId];
    if (!color) {
        return FALLBACK_COLORS[fallbackIndex % FALLBACK_COLORS.length];
    }
    return `rgb(${Math.round(color.color_red)}, ${Math.round(color.color_green)}, ${Math.round(color.color_blue)})`;
}

const formatTime = (date: Date) => date.toLocaleTimeString("sv-SE", {hour: "2-digit", minute: "2-digit"});

/** Everything the proposal cards need, derived once from a match. */
export function getMatchCardData({match, idToName, colors}: ProposalProps): MatchCardData {
    const teamIds = [match.TEAM_ID_1, match.TEAM_ID_2, match.TEAM_ID_3, match.TEAM_ID_4];
    const played = match.hands.filter(hand => hand.ROUND > 0);
    const roundNumbers = [...new Set(played.map(hand => hand.ROUND))].sort((a, b) => a - b);

    const running = new Map(teamIds.map(id => [id, STARTING_SCORE]));
    const history = new Map(teamIds.map(id => [id, [STARTING_SCORE]]));
    for (const round of roundNumbers) {
        for (const hand of played.filter(h => h.ROUND === round)) {
            running.set(hand.TEAM_ID, (running.get(hand.TEAM_ID) ?? STARTING_SCORE) + hand.HAND_SCORE);
        }
        teamIds.forEach(id => history.get(id)!.push(running.get(id)!));
    }

    const lastHands = new Map(match.hands.map(hand => [hand.TEAM_ID, hand]));
    const teams = teamIds
        .map((teamId, i) => {
            const teamHands = played.filter(hand => hand.TEAM_ID === teamId);
            return {
                teamId,
                name: idToName[teamId] ?? teamId,
                score: running.get(teamId)!,
                delta: running.get(teamId)! - STARTING_SCORE,
                history: history.get(teamId)!,
                wind: lastHands.get(teamId)?.WIND ?? WIND_ORDER[i],
                color: toCss(colors, teamId, i),
                wins: teamHands.filter(hand => hand.IS_WINNER).length,
                biggestHand: Math.max(0, ...teamHands.map(hand => hand.HAND)),
                rank: 0,
            };
        })
        .sort((a, b) => b.score - a.score)
        .map((team, i, all) => ({...team, rank: i > 0 && all[i - 1].score === team.score ? i : i + 1}));

    const first = new Date(played[0]?.TIME ?? match.TIME);
    const last = new Date(played[played.length - 1]?.TIME ?? match.TIME);
    const biggest = played.reduce<typeof played[number] | null>(
        (best, hand) => (!best || hand.HAND > best.HAND ? hand : best), null);

    return {
        name: match.NAME,
        dateLabel: capitalize(formatDate(match.TIME)),
        timeRange: `${formatTime(first)}–${formatTime(last)}`,
        durationMinutes: Math.round((last.getTime() - first.getTime()) / 60000),
        rounds: roundNumbers.length,
        active: isActiveMatch(match),
        hasLimitHand: match.hands.some(hand => hand.HAND === LIMIT_HAND),
        teams,
        stats: getMatchStats(match),
        biggestHand: biggest && biggest.HAND > 0
            ? {teamName: idToName[biggest.TEAM_ID] ?? biggest.TEAM_ID, hand: biggest.HAND}
            : null,
    };
}

export const WIND_KANJI: { [wind: string]: string } = {E: "東", S: "南", W: "西", N: "北"};

export function formatDelta(delta: number): string {
    return delta > 0 ? `+${delta}` : `${delta}`;
}

export function formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) {
        return `${m} min`;
    }
    return m === 0 ? `${h} h` : `${h} h ${m} min`;
}
