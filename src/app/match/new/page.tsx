"use client";

import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Button, Box, Typography, Container, Chip } from '@mui/material';
import { useRouter } from 'next/navigation';

interface Team {
  id: string;
  name: string;
  concatenatedName: string;
  playerIds: string[];
}

export default function NewMatchPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<(Team | null)[]>([null, null, null, null]);
  const [matchName, setMatchName] = useState('');
  const [matchDescription, setMatchDescription] = useState('');
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
    console.log('Match name:', matchName);
    console.log('Match description:', matchDescription);
    
    // Here you would typically send the data to your backend
    // For example:
    // await fetch('/api/matches', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ teamIds, matchName, matchDescription }),
    // });
    
    // Redirect to the home page after submission
    router.push('/');
  };

  const getFilteredTeams = (index: number) => {
    return teams.filter(team => {
      // Check if this team is already selected
      const isTeamSelected = selectedTeams.some((selectedTeam, i) => i !== index && selectedTeam?.id === team.id);
      
      // Check if any player from this team is already selected in another team
      const isPlayerSelected = team.playerIds.some(playerId => 
        selectedTeams.some((selectedTeam, i) => 
          i !== index && selectedTeam?.playerIds.includes(playerId)
        )
      );

      return !isTeamSelected && !isPlayerSelected;
    });
  };

  const isFormValid = () => {
    return matchName.trim() !== '' &&
           matchDescription.trim() !== '' &&
           selectedTeams.every(team => team !== null);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Skapa ny match
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Matchnamn"
            value={matchName}
            onChange={(e) => setMatchName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Matchbeskrivning"
            value={matchDescription}
            onChange={(e) => setMatchDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            required
          />
          {selectedTeams.map((team, index) => (
            <Autocomplete
              key={index}
              options={getFilteredTeams(index)}
              getOptionLabel={(option) => option.name}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box>
                    <Typography variant="body1">{option.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.concatenatedName}
                    </Typography>
                  </Box>
                </li>
              )}
              value={team}
              onChange={(_, newValue) => handleTeamChange(index, newValue)}
              renderInput={(params) => <TextField {...params} fullWidth label={`Lag ${index + 1}`} margin="normal" required />}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                    key={option.id}
                  />
                ))
              }
            />
          ))}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!isFormValid()}
          >
            Skapa match
          </Button>
        </form>
      </Box>
    </Container>
  );
}
