"use client";

import React, { useState } from "react";
import { TextField, Select, MenuItem, Button, FormControl, InputLabel, Box } from "@mui/material";

export default function RoundResultFormClient({ teamIdToName }: { teamIdToName: { [key: string]: string } }) {
  const [formData, setFormData] = useState<{ [key: string]: any }>({
    scores: {},
    eastTeam: "",
    winner: "",
  });

  // Initialize scores for each team
  Object.keys(teamIdToName).forEach((teamId) => {
    if (!formData.scores[teamId]) {
      formData.scores[teamId] = "";
    }
  });

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
    console.log("Form submitted:", formData);
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
