"use client";

import React, { useState, useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useRouter } from 'next/navigation';

export default function RoundResultFormEdit({ teamIdToName, matchId, hands, round }: { teamIdToName: { [key: string]: string }, matchId: string, hands: any[], round: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState<{ [key: string]: any }>({
    scores: {},
  });

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

  const handleScoreChange = (
    e: any,
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    fetch('/api/updateResult', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...formData, matchId, round }),
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

  const isFormValid = () => {
    const allScoresEntered = Object.values(formData.scores).every(
      (score) => score !== "" && score !== undefined && score !== null
    );
    return allScoresEntered;
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
      <Button type="submit" variant="contained" color="primary" disabled={!isFormValid()}>
        Ändra resultat
      </Button>
    </Box>
  );
}
