"use client";

import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Button, Box, Typography, Container } from '@mui/material';
import { useRouter } from 'next/navigation';

interface Team {
  id: string;
  name: string;
}

export default function NewMatchPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<(Team | null)[]>([null, null, null, null]);
  const router = useRouter();

  useEffect(() => {
    const fetchTeams = async () => {
      const response = await fetch('/api/teams');
      const data = await response.json();
      setTeams(data);
    };
    fetchTeams();
  }, []);

  const handleTeamChange = (index: number, value: Team | null) => {
    const newSelectedTeams = [...selectedTeams];
    newSelectedTeams[index] = value;
    setSelectedTeams(newSelectedTeams);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const teamIds = selectedTeams.map(team => team?.id).filter(Boolean);
    console.log('New match with teams:', teamIds);
    
    // Here you would typically send the data to your backend
    // For example:
    // await fetch('/api/matches', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ teamIds }),
    // });
    
    // Redirect to the home page after submission
    router.push('/');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Skapa ny match
        </Typography>
        <form onSubmit={handleSubmit}>
          {selectedTeams.map((team, index) => (
            <Autocomplete
              key={index}
              options={teams}
              getOptionLabel={(option) => option.name}
              value={team}
              onChange={(_, newValue) => handleTeamChange(index, newValue)}
              renderInput={(params) => <TextField {...params} fullWidth label={`Lag ${index + 1}`} margin="normal" />}
            />
          ))}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Skapa match
          </Button>
        </form>
      </Box>
    </Container>
  );
}
