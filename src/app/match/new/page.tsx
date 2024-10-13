"use client";

import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function NewMatchPage() {
  const [playerNames, setPlayerNames] = useState(['', '', '', '']);
  const router = useRouter();

  const handlePlayerNameChange = (index: number, value: string) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = value;
    setPlayerNames(newPlayerNames);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Here you would typically send the data to your backend
    // For now, we'll just log it and redirect
    console.log('New match with players:', playerNames);
    
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
          {playerNames.map((name, index) => (
            <TextField
              key={index}
              fullWidth
              label={`Spelare ${index + 1}`}
              value={name}
              onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              margin="normal"
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
