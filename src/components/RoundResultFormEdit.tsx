"use client";

import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Snackbar, Alert } from "@mui/material";
import { useRouter } from "next/navigation";

export default function RoundResultFormEdit({
  teamIdToName,
  matchId,
  hands,
  round,
}: {
  readonly teamIdToName: { [key: string]: string };
  readonly matchId: string;
  readonly hands: any[];
  readonly round: string;
}) {
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
    }, {} as { [key: string]: string });

    setFormData((prevData) => ({
      ...prevData,
      scores: initialScores,
    }));
  }, [teamIdToName]);

  const handleScoreChange = (e: any, teamId: string) => {
    const { value } = e.target;
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
      body: JSON.stringify({ ...formData, matchId, round }),
    })
      .then((response) => response.json())
      .then((data) => {
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
    const allScoresEntered = Object.values(formData.scores).every(
      (score) =>
        score !== "" &&
        score !== undefined &&
        score !== null &&
        Number(score) % 2 == 0
    );
    return allScoresEntered;
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mt: 3 }}
    >
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {Object.entries(teamIdToName).map(([teamId, teamName]) => (
          <TextField
            key={teamId}
            label={`${teamName} poäng`}
            type="number"
            value={formData.scores[teamId] || ""}
            onChange={(e) => handleScoreChange(e, teamId)}
            margin="normal"
            sx={{ flex: "1 1 200px" }}
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
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
