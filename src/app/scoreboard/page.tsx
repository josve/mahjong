import React from "react";
import { Metadata } from "next";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Box,
} from "@mui/material";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Poängtabell - Mahjong Master System",
  };
}

export default function ScoreboardPage() {
  return (
      <Box>
        <h1>
          Poängtabell
        </h1>
        <h2 className="score-board-header">
          Ordinarie poäng
        </h2>
        <Paper>
          <Box className="score-board-section">
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Öppen</TableCell>
                <TableCell>Dold</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Tretal 2-8</TableCell>
                <TableCell>2</TableCell>
                <TableCell>4</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tretal 1, 9</TableCell>
                <TableCell>4</TableCell>
                <TableCell>8</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tretal vindar</TableCell>
                <TableCell>4</TableCell>
                <TableCell>8</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tretal drakar</TableCell>
                <TableCell>4</TableCell>
                <TableCell>8</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Fyrtal 2-8</TableCell>
                <TableCell>8</TableCell>
                <TableCell>16</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Fyrtal 1, 9</TableCell>
                <TableCell>16</TableCell>
                <TableCell>32</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Fyrtal vindar</TableCell>
                <TableCell>16</TableCell>
                <TableCell>32</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Fyrtal drakar</TableCell>
                <TableCell>16</TableCell>
                <TableCell>32</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Par drakar</TableCell>
                <TableCell>2</TableCell>
                <TableCell>2</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Par egen vind</TableCell>
                <TableCell>2</TableCell>
                <TableCell>2</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Blomma/årstid</TableCell>
                <TableCell>4</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          </Box>
        </Paper>

        <h2 className="score-board-header">
          Multiplikatorer
        </h2>
        <Paper>
          <Box className="score-board-section">
            <Box className="score-board-row">
              <Typography>Tretal eller fyrtal egen vind</Typography>
              <Typography>X2</Typography>
            </Box>
            <Box className="score-board-row">
              <Typography>Tretal eller fyrtal drakar</Typography>
              <Typography>X2</Typography>
            </Box>
            <Box className="score-board-row">
              <Typography>Tre dolda tre- eller fyrtal</Typography>
              <Typography>X2</Typography>
            </Box>
            <Box className="score-board-row">
              <Typography>Hel stege 1-9 av en sort</Typography>
              <Typography>X2</Typography>
            </Box>
          </Box>
        </Paper>

        <h2 className="score-board-header">
          Vinnaren
        </h2>
        <Paper>
          <Box className="score-board-section">
            <Box className="score-board-row">
              <Typography>Mahjong</Typography>
              <Typography>10</Typography>
            </Box>
            <Box className="score-board-row">
              <Typography>Mahjong på egen dragen bricka</Typography>
              <Typography>2</Typography>
            </Box>
            <Box className="score-board-row">
              <Typography>Dold mahjong på slängd bricka</Typography>
              <Typography>2</Typography>
            </Box>
            <Box className="score-board-row">
              <Typography>Dold mahjong på egen dragen bricka</Typography>
              <Typography>X2</Typography>
            </Box>
            <Box className="score-board-row">
              <Typography>Mahjong på sista brickan i spelet</Typography>
              <Typography>X2</Typography>
            </Box>
            <Box className="score-board-row">
              <Typography>Mahjong på dragen extrabricka efter Kong</Typography>
              <Typography>X2</Typography>
            </Box>
            <Box className="score-board-row">
              <Typography>Inga poäng</Typography>
              <Typography>10</Typography>
            </Box>
            <Box className="score-board-row">
              <Typography>En sort och vindar eller drakar</Typography>
              <Typography>X2</Typography>
            </Box>
            <Box className="score-board-row">
              <Typography>Uteslutande en sort</Typography>
              <Typography>X8</Typography>
            </Box>
            <Box className="score-board-row">
              <Typography>Inga stegar</Typography>
              <Typography>X2</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
  );
}
