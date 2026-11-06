import React from "react";
import { Metadata } from "next";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { getTranslations } from "next-intl/server";
import type messages from "../../../messages/sv.json";

type Scoreboard = typeof messages.scoreboard;

/** Basic points for exposed and concealed sets, labelled by the keys in scoreboard.basic. */
const BASIC_SCORES: { key: keyof Scoreboard["basic"]; exposed: string; concealed: string }[] = [
  { key: "pungSimples", exposed: "2", concealed: "4" },
  { key: "pungTerminals", exposed: "4", concealed: "8" },
  { key: "pungWinds", exposed: "4", concealed: "8" },
  { key: "pungDragons", exposed: "4", concealed: "8" },
  { key: "kongSimples", exposed: "8", concealed: "16" },
  { key: "kongTerminals", exposed: "16", concealed: "32" },
  { key: "kongWinds", exposed: "16", concealed: "32" },
  { key: "kongDragons", exposed: "16", concealed: "32" },
  { key: "pairDragons", exposed: "2", concealed: "2" },
  { key: "pairOwnWind", exposed: "2", concealed: "2" },
  { key: "flowerSeason", exposed: "4", concealed: "-" },
];

const MULTIPLIERS: { key: keyof Scoreboard["multipliers"]; value: string }[] = [
  { key: "ownWind", value: "X2" },
  { key: "dragons", value: "X2" },
  { key: "threeConcealed", value: "X2" },
  { key: "fullStraight", value: "X2" },
];

const WINNER_SCORES: { key: keyof Scoreboard["winner"]; value: string }[] = [
  { key: "mahjong", value: "10" },
  { key: "selfDrawn", value: "2" },
  { key: "concealedDiscard", value: "2" },
  { key: "concealedSelfDrawn", value: "X2" },
  { key: "lastTile", value: "X2" },
  { key: "kongReplacement", value: "X2" },
  { key: "noPoints", value: "10" },
  { key: "halfFlush", value: "X2" },
  { key: "fullFlush", value: "X8" },
  { key: "noChows", value: "X2" },
];

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("app.pageTitle", { title: t("scoreboard.title") }),
  };
}

export default async function ScoreboardPage() {
  const t = await getTranslations("scoreboard");

  return (
      <Box>
        <h1>
          {t("title")}
        </h1>
        <h2 className="score-board-header">
          {t("basicTitle")}
        </h2>
        <Paper>
          <Box className="score-board-section">
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>{t("exposed")}</TableCell>
                <TableCell>{t("concealed")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {BASIC_SCORES.map(({ key, exposed, concealed }) => (
                <TableRow key={key}>
                  <TableCell>{t(`basic.${key}`)}</TableCell>
                  <TableCell>{exposed}</TableCell>
                  <TableCell>{concealed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </Box>
        </Paper>

        <h2 className="score-board-header">
          {t("multipliersTitle")}
        </h2>
        <Paper>
          <Box className="score-board-section">
            {MULTIPLIERS.map(({ key, value }) => (
              <Box className="score-board-row" key={key}>
                <Typography>{t(`multipliers.${key}`)}</Typography>
                <Typography>{value}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        <h2 className="score-board-header">
          {t("winnerTitle")}
        </h2>
        <Paper>
          <Box className="score-board-section">
            {WINNER_SCORES.map(({ key, value }) => (
              <Box className="score-board-row" key={key}>
                <Typography>{t(`winner.${key}`)}</Typography>
                <Typography>{value}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
  );
}
