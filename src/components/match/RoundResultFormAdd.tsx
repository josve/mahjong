"use client";

import React, { useState } from "react";
import {TextField, Button, Box, FormControl, InputLabel, Select, MenuItem} from "@mui/material";
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
    const allScoresEntered = Object.entries(teamIdToName).every(([teamId, teamName]) => (
      formData.scores[teamId] && formData.scores[teamName] != "" &&
      formData.scores[teamId] !== undefined &&
      formData.scores[teamId] !== null &&
      Number(formData.scores[teamId]) % 2 == 0
    ));

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
        setFormData({
          scores: {},
          eastTeam: "",
          winner: "-1",
        });
        window.location.reload();
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
            margin="normal"
            sx={{ flex: "1 1 200px" }}
          />
        ))}
      </Box>
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr",  flexWrap: "wrap", marginTop: 2 }}>
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
        sx={{ marginTop: 2 }}
      >
        Lägg till resultat
      </Button>
    </Box>
  );
}
