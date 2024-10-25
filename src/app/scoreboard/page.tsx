import React from "react";
import { Metadata } from "next";
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography, Box } from "@mui/material";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Poängtabell - Mahjong Master System",
  };
}

export default function ScoreboardPage() {
  return (
    <Box
      sx={{
        padding: "40px",
        fontFamily: "HelveticaNeueLight, Helvetica, Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <Typography variant="h1">Poängtabell</Typography>

      <Typography
        variant="h2"
        sx={{
          color: "#943030",
          fontSize: "28px",
          marginTop: "40px",
          borderBottom: "2px solid #943030",
          paddingBottom: "10px",
        }}
      >
        Ordinarie poäng
      </Typography>
      <Paper>
        <Table>
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
      </Paper>

      <Typography
        variant="h2"
        sx={{
          color: "#943030",
          fontSize: "28px",
          marginTop: "40px",
          borderBottom: "2px solid #943030",
          paddingBottom: "10px",
        }}
      >
        Multiplikatorer
      </Typography>
      <Paper>
        <Box
          sx={{
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography>Tretal eller fyrtal egen vind: X2</Typography>
          <Typography>Tretal eller fyrtal drakar: X2</Typography>
          <Typography>Tre dolda tre- eller fyrtal: X2</Typography>
          <Typography>Hel stege 1-9 av en sort: X2</Typography>
        </Box>
      </Paper>

      <Typography
        variant="h2"
        sx={{
          color: "#943030",
          fontSize: "28px",
          marginTop: "40px",
          borderBottom: "2px solid #943030",
          paddingBottom: "10px",
        }}
      >
        Vinnaren
      </Typography>
      <Paper>
        <Box
          sx={{
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography>Mahjong: 10</Typography>
          <Typography>Mahjong på egen dragen bricka: 2</Typography>
          <Typography>Dold mahjong på slängd bricka: 2</Typography>
          <Typography>Dold mahjong på egen dragen bricka: X2</Typography>
          <Typography>Mahjong på sista brickan i spelet: X2</Typography>
          <Typography>Mahjong på dragen extrabricka efter Kong: X2</Typography>
          <Typography>Inga poäng: 10</Typography>
          <Typography>En sort och vindar eller drakar: X2</Typography>
          <Typography>Uteslutande en sort: X8</Typography>
          <Typography>Inga stegar: X2</Typography>
        </Box>
      </Paper>
    </Box>
  );
}
