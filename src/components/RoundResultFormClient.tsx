"use client";

import React, { useState, useEffect } from "react";
import { TextField, Select, MenuItem, Button, FormControl, InputLabel, Box } from "@mui/material";

export default function RoundResultFormClient({ teamIdToName, matchId, hands }: { teamIdToName: { [key: string]: string }, matchId: string, hands: any[] }) {
  console.log("RoundResultFormClient hands:", hands);
  const [formData, setFormData] = useState<{ [key: string]: any }>({
    scores: {},
    eastTeam: "",
    winner: "",
  });

  useEffect(() => {
    // Initialize scores for each team from hands data
    const initialScores = hands.reduce((acc, hand) => {
      acc[hand.TEAM_ID] = hand.HAND || "";
      return acc;
    }, {} as { [key: string]: string });

    setFormData((prevData) => ({
      ...prevData,
      scores: initialScores,
    }));
  }, [teamIdToName]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
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
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const isFormValid = () => {
    const allScoresEntered = Object.values(formData.scores).every(
      (score) => score !== ""
    );
    return formData.eastTeam !== "" && formData.winner !== "" && allScoresEntered;
  };
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {Object.entries(teamIdToName).map(([teamId, teamName]) => (
          <TextField
            key={teamId}
            label={`${teamName} Score`}
            type="number"
            value={formData.scores[teamId]}
            onChange={(e) => handleScoreChange(e, teamId)}
            margin="normal"
            sx={{ flex: '1 1 200px' }}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl fullWidth sx={{ flex: '1 1 200px' }} margin="normal">
          <InputLabel>East Team</InputLabel>
          <Select
            name="eastTeam"
            value={formData.eastTeam}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Select East Team</em>
            </MenuItem>
            {Object.entries(teamIdToName).map(([teamId, teamName]) => (
              <MenuItem key={teamId} value={teamId}>
                {teamName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ flex: '1 1 200px' }} margin="normal">
          <InputLabel>Winner</InputLabel>
          <Select
            name="winner"
            value={formData.winner}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Select Winner</em>
            </MenuItem>
            {Object.entries(teamIdToName).map(([teamId, teamName]) => (
              <MenuItem key={teamId} value={teamId}>
                {teamName}
              </MenuItem>
            ))}
            <MenuItem value="none">No Winner</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Button type="submit" variant="contained" color="primary" disabled={!isFormValid()}>
        Add Result
      </Button>
    </Box>
  );
}
