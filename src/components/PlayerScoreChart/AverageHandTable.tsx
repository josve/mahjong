import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

interface AverageHandTableProps {
  averageHand: { [key: string]: number };
  getPlayerColor: (playerName: string) => string | undefined;
}

const AverageHandTable: React.FC<AverageHandTableProps> = ({
                                                             averageHand,
                                                             getPlayerColor,
                                                           }) => {

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Spelare</TableCell>
          <TableCell>Medelpoäng (omgång)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(averageHand).map(([player, avgHand]) => (
          <TableRow key={player}>
            <TableCell style={{ color: getPlayerColor(player) }}>
              {player}
            </TableCell>
            <TableCell>{avgHand.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AverageHandTable;
