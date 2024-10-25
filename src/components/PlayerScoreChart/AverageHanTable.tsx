import React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";

interface AverageHanTableProps {
  averageHan: { [key: string]: number };
  playerColors: {
    [key: string]: {
      color_red: number;
      color_green: number;
      color_blue: number;
    };
  };
}

const AverageHanTable: React.FC<AverageHanTableProps> = ({
  averageHan,
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
          <TableCell>Player</TableCell>
          <TableCell>Average Han</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(averageHan).map(([player, avgHan]) => (
          <TableRow key={player}>
            <TableCell style={{ color: getPlayerColor(player) }}>{player}</TableCell>
            <TableCell>{avgHan.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AverageHanTable;
