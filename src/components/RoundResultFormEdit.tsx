"use client";

import React, {useEffect, useState} from "react";
import {Alert, Box, Button, Snackbar, TextField} from "@mui/material";
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
  const [formData, setFormData] = useState<{ [key: string]: any }>({
    scores: {},
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  useEffect(() => {
    const initialScores = hands.reduce((acc, hand) => {
      acc[hand.TEAM_ID] = hand.HAND;
      return acc;
    }, {} as { [key: string]: number });

    setFormData((prevData) => ({
      ...prevData,
      scores: initialScores,
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
