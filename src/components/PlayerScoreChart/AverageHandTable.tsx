import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import {MahjongStats} from "@/lib/statistics";

interface AverageHandTableProps {
    stats: MahjongStats;
    includeTeams: boolean;
}

const AverageHandTable: React.FC<AverageHandTableProps> = ({
                                                               stats,
                                                               includeTeams
                                                           }) => {

    const nonTeams = stats.getDataToShow(includeTeams);

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Spelare</TableCell>
                    <TableCell>Medelpoäng (omgång)</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {nonTeams.map((player) => (
                    <TableRow key={player.id}>
                        <TableCell style={{color: player.color}}>
                            {player.name}
                        </TableCell>
                        <TableCell>{player.averageHand.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default AverageHandTable;
