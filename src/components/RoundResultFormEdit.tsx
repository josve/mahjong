"use client";

import React, {useEffect, useState} from "react";
import {Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, TextField} from "@mui/material";
import {useRouter} from "next/navigation";
import {UpdateResultResponse} from "@/types/api";
import {Hand, IdToName} from "@/types/db";

interface Props {
  readonly teamIdToName: IdToName;
  readonly matchId: string;
  readonly hands: Hand[];
  readonly round: string;
}

export default function RoundResultFormEdit({
  teamIdToName,
  matchId,
  hands,
  round,
}: Props) {
  const router = useRouter();

  let winner: any  = "-1";
  let east: any = "";

  hands.forEach((hand: Hand) => {
    if (hand.IS_WINNER) {
      winner = hand.TEAM_ID;
    }
    if (hand.WIND == 'E') {
      east = hand.TEAM_ID;
    }
  })

  const [formData, setFormData] = useState<{ [key: string]: any }>({
    scores: {},
    winner: winner,
    eastTeam: east,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  useEffect(() => {

    let winner: any  = "-1";
    let east: any = "";

    const initialScores = hands.reduce((acc, hand) => {
      if (hand.IS_WINNER) {
        winner = hand.TEAM_ID;
      }
      if (hand.WIND == 'E') {
        east = hand.TEAM_ID;
      }
      acc[hand.TEAM_ID] = hand.HAND;
      return acc;
    }, {} as { [key: string]: number });

    setFormData((prevData) => ({
      ...prevData,
      scores: initialScores,
      winner: winner,
      eastTeam: east,
    }));
  }, [teamIdToName]);

  const handleScoreChange = (e: any, teamId: string) => {
    const {value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      scores: {
        ...prevData.scores,
        [teamId]: value,
      },
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    fetch("/api/updateResult", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...formData, matchId, round}),
    })
        .then((response) => response.json())
        .then((data: UpdateResultResponse) => {
          setSnackbarMessage("Resultat är uppdaterat!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          setTimeout(() => {
            router.push(`/match/${matchId}/edit`);
          }, 1000);
        })
        .catch((error) => {
          setSnackbarMessage("Misslyckades med att uppdatera resultatet.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          console.error("Error:", error);
        });
  };

  const isFormValid = () => {
    return Object.values(formData.scores).every(
        (score) =>
            score !== "" &&
            score !== undefined &&
            score !== null &&
            Number(score) % 2 == 0
    );
  };

  const handleEastTeamChange = (e: any) => {
    setFormData((prevData) => ({
      ...prevData,
      eastTeam: e.target.value,
    }));
  };

  const handleWinnerChange = (e: any) => {
    setFormData((prevData) => ({
      ...prevData,
      winner: e.target.value,
    }));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
      <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{mt: 3}}
      >
        <Box sx={{display: "flex", gap: 2, flexWrap: "wrap"}}>
          {Object.entries(teamIdToName).map(([teamId, teamName]) => (
              <TextField
                  key={teamId}
                  label={`${teamName} poäng`}
                  type="number"
                  value={formData.scores[teamId] || ""}
                  onChange={(e) => handleScoreChange(e, teamId)}
                  margin="normal"
                  sx={{flex: "1 1 200px"}}
              />
          ))}
        </Box>
        <Box sx={{display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr", flexWrap: "wrap", marginTop: 2, marginBottom: 2}}>
          <FormControl fullWidth>
            <InputLabel id="east-label">Öst</InputLabel>
            <Select
                labelId="east-label"
                id="east-select"
                label="Öst"
                value={formData.eastTeam}
                onChange={handleEastTeamChange}
            >
              <MenuItem value="">Välj spelare i öst</MenuItem>
              {Object.entries(teamIdToName).map(([teamId, teamName]) => (
                  <MenuItem
                      key={teamId}
                      value={teamId}
                  >
                    {teamName}
                  </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="winner-label">Vinnare</InputLabel>
            <Select
                labelId="winner-label"
                id="winner-select"
                label="Vinnare"
                value={formData.winner}
                onChange={handleWinnerChange}
            >
              <MenuItem value="-1">Välj vinnare</MenuItem>
              <MenuItem value="">Ingen vinnare</MenuItem>
              {Object.entries(teamIdToName).map(([teamId, teamName]) => (
                  <MenuItem
                      key={teamId}
                      value={teamId}
                  >
                    {teamName}
                  </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button
            type="submit"
            variant="contained"
            disabled={!isFormValid()}
        >
          Ändra resultat
        </Button>
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
        >
          <Alert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              sx={{width: '100%'}}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
  );
}
