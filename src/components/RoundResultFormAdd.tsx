"use client";

import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useRouter } from 'next/navigation';

export default function RoundResultFormAdd({ teamIdToName, matchId }: { teamIdToName: { [key: string]: string }, matchId: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState<{ [key: string]: any }>({
    scores: {},
    eastTeam: "",
    winner: "",
  });

  const handleScoreChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    teamId: string
  ) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      scores: {
        ...prevData.scores,
        [teamId]: value,
      },
    }));
  };

  const handleEastTeamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      eastTeam: e.target.value,
    }));
  };

  const handleWinnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const winnerSelected = formData.winner !== "";
    return allScoresEntered && eastTeamSelected && winnerSelected;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/addResult', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...formData, matchId }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        router.push(`/match/${matchId}`);
      }) 
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {Object.entries(teamIdToName).map(([teamId, teamName]) => (
          <TextField
            key={teamId}
            label={`${teamName} Score`}
            type="number"
            value={formData.scores[teamId] || ""}
            onChange={(e) => handleScoreChange(e, teamId)}
            focused
            margin="normal"
            sx={{ flex: '1 1 200px' }}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginTop: 2 }}>
        <TextField
          select
          label="East Team"
          value={formData.eastTeam}
          onChange={handleEastTeamChange}
          SelectProps={{
            native: true,
          }}
          sx={{ flex: '1 1 200px' }}
        >
          <option value="">Select East Team</option>
          {Object.entries(teamIdToName).map(([teamId, teamName]) => (
            <option key={teamId} value={teamId}>
              {teamName}
            </option>
          ))}
        </TextField>
        <TextField
          select
          label="Winner"
          value={formData.winner}
          onChange={handleWinnerChange}
          SelectProps={{
            native: true,
          }}
          sx={{ flex: '1 1 200px' }}
        >
          <option value="">Select Winner</option>
          {Object.entries(teamIdToName).map(([teamId, teamName]) => (
            <option key={teamId} value={teamId}>
              {teamName}
            </option>
          ))}
        </TextField>
      </Box>
      <Button type="submit" variant="contained" color="primary" disabled={!isFormValid()} sx={{ marginTop: 2 }}>
        Lägg till resultat
      </Button>
    </Box>
  );
}
