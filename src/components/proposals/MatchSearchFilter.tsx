"use client";

import React, {useMemo, useState} from "react";
import {
    Box,
    InputAdornment,
    MenuItem,
    Paper,
    Select,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {ProposalTeam, ProposalTeamScore, TeamAvatar} from "@/components/proposals/shared";

export interface SearchableMatch {
    id: string;
    index: number;
    name: string;
    comment?: string;
    time: Date;
    teams: ProposalTeamScore[];
}

type Period = "all" | "year" | "month";
type Sort = "newest" | "oldest" | "highest";

interface Props {
    readonly matches: SearchableMatch[];
    /** Players and teams that can be used as filters. */
    readonly teams: ProposalTeam[];
    readonly initialQuery?: string;
    readonly initialTeams?: string[];
}

const PERIOD_DAYS: { [period in Period]: number } = {all: Infinity, year: 365, month: 31};

/**
 * Förslag 4: Search and filter the match list, today it is one long list of
 * every match ever played.
 */
export default function MatchSearchFilter({matches, teams, initialQuery = "", initialTeams = []}: Props) {
    const [query, setQuery] = useState(initialQuery);
    const [selectedTeams, setSelectedTeams] = useState<string[]>(initialTeams);
    const [period, setPeriod] = useState<Period>("all");
    const [sort, setSort] = useState<Sort>("newest");

    const results = useMemo(() => {
        const now = Date.now();
        const needle = query.trim().toLowerCase();
        const filtered = matches.filter((match) => {
            const text = [match.name, match.comment ?? "", ...match.teams.map((team) => team.name)].join(" ").toLowerCase();
            return (!needle || text.includes(needle))
                && selectedTeams.every((id) => match.teams.some((team) => team.id === id))
                && (now - match.time.getTime()) / 86400000 <= PERIOD_DAYS[period];
        });
        const best = (match: SearchableMatch) => Math.max(...match.teams.map((team) => team.score));
        return filtered.sort((a, b) => {
            if (sort === "oldest") return a.time.getTime() - b.time.getTime();
            if (sort === "highest") return best(b) - best(a);
            return b.time.getTime() - a.time.getTime();
        });
    }, [matches, query, selectedTeams, period, sort]);

    const toggleTeam = (id: string) =>
        setSelectedTeams((prev) => prev.includes(id) ? prev.filter((other) => other !== id) : [...prev, id]);

    return (
        <Box sx={{maxWidth: 760}}>
            <Paper elevation={0} sx={{p: 2, borderRadius: 3, border: "1px solid #eee", display: "grid", gap: 1.5, backgroundColor: "white"}}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Sök match, kommentar eller spelare…"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    slotProps={{input: {startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>}}}
                />
                <Box sx={{display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center"}}>
                    <Typography variant="body2" sx={{mr: 0.5}}>Spelade med:</Typography>
                    {teams.map((team) => {
                        const selected = selectedTeams.includes(team.id);
                        return (
                            <Box
                                key={team.id}
                                component="button"
                                onClick={() => toggleTeam(team.id)}
                                aria-pressed={selected}
                                sx={{
                                    display: "flex", alignItems: "center", gap: 0.75, pr: 1.5, pl: 0.5, py: 0.5,
                                    borderRadius: 5, cursor: "pointer", font: "inherit", fontSize: 14,
                                    border: "1px solid", borderColor: selected ? team.color : "#ddd",
                                    backgroundColor: selected ? team.color : "white",
                                    color: selected ? "white" : "#606060",
                                    opacity: selectedTeams.length && !selected ? 0.6 : 1,
                                }}
                            >
                                <TeamAvatar team={team} size={22} sx={{border: selected ? "2px solid white" : 0}}/>
                                {team.name}
                            </Box>
                        );
                    })}
                </Box>
                <Box sx={{display: "flex", gap: 1, justifyContent: "space-between", flexWrap: "wrap"}}>
                    <ToggleButtonGroup size="small" exclusive value={period} onChange={(_, value: Period | null) => value && setPeriod(value)}>
                        <ToggleButton value="all">Alla</ToggleButton>
                        <ToggleButton value="year">Senaste året</ToggleButton>
                        <ToggleButton value="month">Senaste månaden</ToggleButton>
                    </ToggleButtonGroup>
                    <Select size="small" value={sort} onChange={(event) => setSort(event.target.value as Sort)}>
                        <MenuItem value="newest">Nyast först</MenuItem>
                        <MenuItem value="oldest">Äldst först</MenuItem>
                        <MenuItem value="highest">Högst vinnarpoäng</MenuItem>
                    </Select>
                </Box>
            </Paper>

            <Typography variant="body2" sx={{mt: 2, mb: 1}}>{results.length} av {matches.length} matcher</Typography>

            <Box sx={{display: "grid", gap: 1}}>
                {results.map((match) => {
                    const winner = [...match.teams].sort((a, b) => b.score - a.score)[0];
                    return (
                        <Paper key={match.id} elevation={0} sx={{p: 1.5, borderRadius: 2, backgroundColor: "var(--grid-background-color)", display: "flex", alignItems: "center", gap: 2}}>
                            <Box sx={{flexGrow: 1, minWidth: 0}}>
                                <Typography variant="h6" sx={{fontSize: 15}} noWrap>#{match.index} {match.name}</Typography>
                                <Typography variant="body2" sx={{fontSize: 13}}>
                                    {match.time.toLocaleDateString("sv-SE", {day: "numeric", month: "short", year: "numeric"})}
                                </Typography>
                            </Box>
                            <Box sx={{display: "flex"}}>
                                {match.teams.map((team) => <TeamAvatar key={team.id} team={team} size={28} sx={{ml: -0.5, fontSize: 10, border: "2px solid white"}}/>)}
                            </Box>
                            <Box sx={{display: "flex", alignItems: "center", gap: 0.5, minWidth: 130, justifyContent: "flex-end"}}>
                                <EmojiEventsIcon sx={{fontSize: 16, color: "#E0B000"}}/>
                                <Typography variant="body1" noWrap sx={{fontWeight: 700}}>{winner.name} {winner.score}</Typography>
                            </Box>
                        </Paper>
                    );
                })}
                {results.length === 0 && (
                    <Typography variant="body2" sx={{textAlign: "center", py: 4}}>Inga matcher matchar filtret 🀄</Typography>
                )}
            </Box>
        </Box>
    );
}
