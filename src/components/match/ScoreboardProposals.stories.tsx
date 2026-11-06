import React from "react";
import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import {Box, Card, CardContent, Chip, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";
import {EmojiEvents} from "@mui/icons-material";
import {motion} from "motion/react";
import {ScoreboardTeam, scoreboardTeams} from "@/components/match/SplitFlapScoreboard";
import {activeMatch, matchChartResponse} from "@/stories/fixtures";

const {teamIdToName, teamColors} = matchChartResponse(activeMatch);
const TEAMS = scoreboardTeams(activeMatch.hands.filter((h) => h.ROUND <= 12), teamIdToName, teamColors);
const ROUND = 12;

const sorted = (teams: ScoreboardTeam[]) => [...teams].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
const fmt = (d: number) => (d > 0 ? `+${d}` : d < 0 ? `−${Math.abs(d)}` : "±0");
const deltaColor = (d: number) => (d > 0 ? "#2e7d32" : d < 0 ? "error.main" : "text.secondary");
const Dot = ({color, size = 10}: { color: string; size?: number }) => (
    <Box component="span" sx={{width: size, height: size, borderRadius: "50%", bgcolor: color, flexShrink: 0, display: "inline-block"}}/>
);

/** A: one card styled like the match cards on the start page, with a legend-style list. */
function ListCard({teams, round}: { teams: ScoreboardTeam[]; round: number }) {
    return (
        <Card sx={{my: 2}}>
            <CardContent>
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5}}>
                    <Typography variant="h6">Ställning</Typography>
                    <Typography variant="body2" color="primary">Omgång {round}</Typography>
                </Box>
                {sorted(teams).map((team, i) => (
                    <motion.div layout key={team.id}>
                        <Box sx={{
                            display: "flex", alignItems: "center", gap: 1.5, py: 1,
                            borderTop: i === 0 ? "none" : "1px solid #f0f0f0",
                        }}>
                            <Typography variant="body2" sx={{width: 16, textAlign: "right"}}>{i + 1}</Typography>
                            <Dot color={team.color} size={12}/>
                            <Typography variant="body1" sx={{flex: 1, fontWeight: i === 0 ? 700 : 400, fontSize: 18}}>
                                {team.name}
                            </Typography>
                            <Typography variant="body1" sx={{fontWeight: 700, fontSize: 22, fontVariantNumeric: "tabular-nums"}}>
                                {team.score}
                            </Typography>
                            <Typography variant="body2" sx={{width: 48, textAlign: "right", fontWeight: 700, color: deltaColor(team.delta)}}>
                                {fmt(team.delta)}
                            </Typography>
                        </Box>
                    </motion.div>
                ))}
            </CardContent>
        </Card>
    );
}

/** B: four tiles that mirror the "Senaste omgången" cards below the chart. */
function Tiles({teams}: { teams: ScoreboardTeam[]; round: number }) {
    return (
        <Grid container spacing={2} sx={{my: 2}}>
            {sorted(teams).map((team, i) => (
                <Grid key={team.id} size={{xs: 6, md: 3}}>
                    <Box sx={{
                        border: "1px solid #e0e0e0", borderLeft: `5px solid ${team.color}`, borderRadius: 2, p: 2,
                        position: "relative", bgcolor: "#fff",
                    }}>
                        {i === 0 && <EmojiEvents sx={{position: "absolute", top: 10, right: 10, color: "#F6C400"}}/>}
                        <Typography variant="body2">{i + 1}:a plats</Typography>
                        <Typography variant="h6" gutterBottom>{team.name}</Typography>
                        <Typography sx={{fontSize: 32, fontWeight: 700, lineHeight: 1.1, color: "#606060", fontVariantNumeric: "tabular-nums"}}>
                            {team.score}
                        </Typography>
                        <Typography variant="body2" sx={{mt: 0.5, fontWeight: 700, color: deltaColor(team.delta)}}>
                            {fmt(team.delta)} senaste omgången
                        </Typography>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
}

/** C: a section header with red underline plus a table, like the Poängtabell page. */
function TableSection({teams, round}: { teams: ScoreboardTeam[]; round: number }) {
    const head = {color: "primary.main", fontSize: 13, borderBottom: "none"};
    const cell = {borderBottom: "none", py: 1.25};
    return (
        <Box sx={{my: 3}}>
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid", borderColor: "primary.main", pb: 1}}>
                <Typography variant="h5" sx={{fontWeight: 400}}>Ställning</Typography>
                <Chip size="small" label={`Omgång ${round}`} sx={{bgcolor: "primary.main", color: "#fff"}}/>
            </Box>
            <Paper elevation={1} sx={{bgcolor: "background.paper", px: 1}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{...head, width: 40}}>#</TableCell>
                            <TableCell sx={head}>Lag</TableCell>
                            <TableCell sx={head} align="right">Poäng</TableCell>
                            <TableCell sx={{...head, width: 90}} align="right">Senaste</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sorted(teams).map((team, i) => (
                            <TableRow key={team.id}>
                                <TableCell sx={{...cell, color: "primary.main", fontWeight: 700}}>{i + 1}</TableCell>
                                <TableCell sx={{...cell, color: "text.primary", fontSize: 16}}>
                                    <Box sx={{display: "flex", alignItems: "center", gap: 1}}><Dot color={team.color}/>{team.name}</Box>
                                </TableCell>
                                <TableCell sx={{...cell, color: "primary.main", fontWeight: 700, fontSize: 18}} align="right">{team.score}</TableCell>
                                <TableCell sx={{...cell, color: deltaColor(team.delta), fontWeight: 700}} align="right">{fmt(team.delta)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}

const meta = {title: "Proposals/Scoreboard", args: {teams: TEAMS, round: ROUND}} satisfies Meta<typeof ListCard>;
export default meta;
type Story = StoryObj<typeof meta>;

const frame = (C: React.ComponentType<{ teams: ScoreboardTeam[]; round: number }>) => (args: { teams: ScoreboardTeam[]; round: number }) => (
    <Box sx={{maxWidth: 1112, mx: "auto", p: 2}}><C {...args}/></Box>
);
export const A_ListCard: Story = {render: frame(ListCard)};
export const B_Tiles: Story = {render: frame(Tiles)};
export const C_Table: Story = {render: frame(TableSection)};
