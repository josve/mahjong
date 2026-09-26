import React from "react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
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
