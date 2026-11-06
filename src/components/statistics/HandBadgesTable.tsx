import React from "react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import {Chip, Typography} from "@mui/material";
import {MahjongStats} from "@/lib/statistics";
import {HAND_BADGES, HandBadgeLabelKey} from "@/components/match/HandBadges";
import {useTranslations} from "next-intl";

interface HandBadgesTableProps {
    stats: MahjongStats;
    includeTeams: boolean;
}

/** Column headers for badges whose label depends on the hand. */
const DYNAMIC_LABELS: { [badgeId: string]: HandBadgeLabelKey } = {
    hogmod: "hogmod",
    storvinnare: "storvinnare",
};

const HandBadgesTable: React.FC<HandBadgesTableProps> = ({
                                                             stats,
                                                             includeTeams
                                                         }) => {
    const t = useTranslations();

    const players = stats.getDataToShow(includeTeams);
    const total = (counts: { [badgeId: string]: number }) =>
        Object.values(counts).reduce((sum, count) => sum + count, 0);

    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>{t("common.player")}</TableCell>
                        {HAND_BADGES.map(badge => (
                            <TableCell key={badge.id} align="center">
                                <Chip
                                    label={typeof badge.label === "string"
                                        ? t(`handBadges.${badge.label}`)
                                        : DYNAMIC_LABELS[badge.id] ? t(`handBadges.${DYNAMIC_LABELS[badge.id]}`) : badge.id}
                                    color={badge.color}
                                    size="small"
                                    icon={badge.icon}
                                />
                            </TableCell>
                        ))}
                        <TableCell align="center">{t("common.total")}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {players.map(player => (
                        <TableRow key={player.id}>
                            <TableCell style={{color: player.color}}>
                                {player.name}
                            </TableCell>
                            {HAND_BADGES.map(badge => {
                                const count = player.handBadgeCounts[badge.id] ?? 0;
                                const longestStreak = player.longestBadgeStreaks[badge.id];
                                return (
                                    <TableCell
                                        key={badge.id}
                                        align="center"
                                        sx={{color: count === 0 ? 'text.disabled' : undefined}}>
                                        {count}
                                        {longestStreak !== undefined && (
                                            <Typography variant="caption" color="text.secondary" sx={{display: "block"}}>
                                                {t("statistics.longestStreak", {streak: longestStreak})}
                                            </Typography>
                                        )}
                                    </TableCell>
                                );
                            })}
                            <TableCell align="center" sx={{fontWeight: 'bold'}}>
                                {total(player.handBadgeCounts)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default HandBadgesTable;
