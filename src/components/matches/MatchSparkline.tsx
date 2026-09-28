import React from "react";
import {Box, Typography} from "@mui/material";
import {GameWithHands, IdToColorMap, IdToName} from "@/types/db";

const STARTING_SCORE = 500;
const WIDTH = 240;
const HEIGHT = 90;
/** Used for teams without a color, for example when the colors could not be fetched. */
const FALLBACK_COLORS = ["#e54646", "#3478c8", "#3caa5a", "#e6a028"];

interface TeamLine {
    readonly teamId: string;
    readonly name: string;
    readonly color: string;
    /** Score after every played round, starting with the starting score. */
    readonly history: number[];
    readonly score: number;
}

function teamColor(colors: IdToColorMap | undefined, teamId: string, index: number): string {
    const color = colors?.[teamId];
    if (!color || color.color_red == null || color.color_green == null || color.color_blue == null) {
        return FALLBACK_COLORS[index % FALLBACK_COLORS.length];
    }
    return `rgb(${Math.round(color.color_red)}, ${Math.round(color.color_green)}, ${Math.round(color.color_blue)})`;
}

function getTeamLines(match: GameWithHands, idToName: IdToName, colors?: IdToColorMap): TeamLine[] {
    const teamIds = [match.TEAM_ID_1, match.TEAM_ID_2, match.TEAM_ID_3, match.TEAM_ID_4];
    const rounds = [...new Set(match.hands.map(hand => hand.ROUND))].sort((a, b) => a - b);
    const running = new Map(teamIds.map(teamId => [teamId, STARTING_SCORE]));
    const history = new Map(teamIds.map(teamId => [teamId, [STARTING_SCORE]]));

    for (const round of rounds) {
        for (const hand of match.hands.filter(hand => hand.ROUND === round)) {
            running.set(hand.TEAM_ID, (running.get(hand.TEAM_ID) ?? STARTING_SCORE) + hand.HAND_SCORE);
        }
        if (round > 0) {
            teamIds.forEach(teamId => history.get(teamId)!.push(running.get(teamId)!));
        }
    }

    return teamIds
        .map((teamId, i) => ({
            teamId,
            name: idToName[teamId] ?? teamId,
            color: teamColor(colors, teamId, i),
            history: history.get(teamId)!,
            score: running.get(teamId)!,
        }))
        .sort((a, b) => b.score - a.score);
}

interface Props {
    readonly match: GameWithHands;
    readonly idToName: IdToName;
    readonly colors?: IdToColorMap;
}

/** Small line chart of each team's score after every round, with the final standings next to it. */
export default function MatchSparkline({match, idToName, colors}: Props) {
    const teams = getTeamLines(match, idToName, colors);
    const steps = teams[0].history.length - 1;
    const all = teams.flatMap(team => team.history);
    const min = Math.min(...all);
    const max = Math.max(...all);
    const x = (i: number) => (i / Math.max(1, steps)) * WIDTH;
    const y = (score: number) => HEIGHT - 4 - ((score - min) / Math.max(1, max - min)) * (HEIGHT - 8);

    return (
        <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
            {steps > 0 && (
                <Box component="svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none"
                     sx={{flex: 1, height: HEIGHT, minWidth: 0}} role="img" aria-label="Poängutveckling per omgång">
                    <line x1={0} x2={WIDTH} y1={y(STARTING_SCORE)} y2={y(STARTING_SCORE)} stroke="#ddd" strokeDasharray="3 3"
                          vectorEffect="non-scaling-stroke"/>
                    {teams.map((team, i) => (
                        <polyline key={team.teamId} fill="none" stroke={team.color} strokeWidth={i === 0 ? 3 : 1.5}
                                  vectorEffect="non-scaling-stroke" strokeLinejoin="round"
                                  points={team.history.map((score, round) => `${x(round)},${y(score)}`).join(" ")}/>
                    ))}
                </Box>
            )}
            <Box sx={{minWidth: 130, flex: steps > 0 ? undefined : 1}}>
                {teams.map((team, i) => (
                    <Box key={team.teamId} sx={{display: "flex", alignItems: "center", gap: 1}}>
                        <Box sx={{width: 10, height: 10, borderRadius: "50%", bgcolor: team.color, flexShrink: 0}}/>
                        <Typography variant="body2" noWrap sx={{flex: 1, color: "text.primary", fontWeight: i === 0 ? 700 : 400}}>
                            {team.name}
                        </Typography>
                        <Typography variant="body2" sx={{fontVariantNumeric: "tabular-nums"}}>{team.score}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
