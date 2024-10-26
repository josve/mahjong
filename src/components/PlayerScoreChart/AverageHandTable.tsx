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
  playerColors: {
    [key: string]: {
      color_red: number;
      color_green: number;
      color_blue: number;
    };
  };
}

const AverageHandTable: React.FC<AverageHandTableProps> = ({
  averageHand,
  playerColors,
}) => {
  const getPlayerColor = (playerName: string) => {
    const playerColor = playerColors[playerName];
    return playerColor
      ? `rgb(${playerColor.color_red}, ${playerColor.color_green}, ${playerColor.color_blue})`
      : undefined;
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Spelare</TableCell>
          <TableCell>Medelpoäng på handen</TableCell>
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
