"use client";

import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useRouter } from "next/navigation";

export default function RoundResultFormAdd({
  teamIdToName,
  matchId,
}: {
  teamIdToName: { [key: string]: string };
  matchId: string;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<{ [key: string]: any }>({
    scores: {},
    eastTeam: "",
    winner: "-1",
  });

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
  const isFormValid = () => {
    const allScoresEntered = Object.values(formData.scores).every(
      (score) => score !== "" && score !== undefined && score !== null
    );
    const eastTeamSelected = formData.eastTeam !== "";
    const winnerSelected = String(formData.winner) !== "-1";
    return allScoresEntered && eastTeamSelected && winnerSelected;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/addResult", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData, matchId }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        router.push(`/match/${matchId}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
            label={`Poäng - ${teamName}`}
            type="number"
            value={formData.scores[teamId] || ""}
            onChange={(e) => handleScoreChange(e, teamId)}
            focused
            margin="normal"
            sx={{ flex: "1 1 200px" }}
          />
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", marginTop: 2 }}>
        <TextField
          select
          label="Öst"
          value={formData.eastTeam}
          onChange={handleEastTeamChange}
          SelectProps={{
            native: true,
          }}
          focused
          sx={{ flex: "1 1 200px" }}
        >
          <option value="">Välj spelare i öst</option>
          {Object.entries(teamIdToName).map(([teamId, teamName]) => (
            <option
              key={teamId}
              value={teamId}
            >
              {teamName}
            </option>
          ))}
        </TextField>
        <TextField
          select
          label="Vinnare"
          value={formData.winner}
          onChange={handleWinnerChange}
          SelectProps={{
            native: true,
          }}
          focused
          sx={{ flex: "1 1 200px" }}
        >
          <option value="-1">Välj vinnare</option>
          <option value="">Ingen vinnare</option>
          {Object.entries(teamIdToName).map(([teamId, teamName]) => (
            <option
              key={teamId}
              value={teamId}
            >
              {teamName}
            </option>
          ))}
        </TextField>
      </Box>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!isFormValid()}
        sx={{ marginTop: 2 }}
      >
        Lägg till resultat
      </Button>
    </Box>
  );
}
