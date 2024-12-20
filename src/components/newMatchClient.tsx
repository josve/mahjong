"use client";

import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Chip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import {MatchesResponse, TeamsResponse} from "@/types/api";


export default function NewMatchClient() {
  const [teams, setTeams] = useState<TeamsResponse[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<(TeamsResponse | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [matchName, setMatchName] = useState("");
  const [matchDescription, setMatchDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchTeams = async () => {
      const response = await fetch("/api/teams");
      const data: TeamsResponse[] = await response.json();
      setTeams(data);
    };
    fetchTeams();
  }, []);

  const handleTeamChange = (index: number, value: TeamsResponse | null) => {
    const newSelectedTeams = [...selectedTeams];
    newSelectedTeams[index] = value;
    setSelectedTeams(newSelectedTeams);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const teamIds = selectedTeams.map((team) => team?.id).filter(Boolean);

    try {
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamIds, matchName, matchDescription }),
      });

      if (!response.ok) {
        throw new Error("Failed to create match");
      }

      const data: MatchesResponse = await response.json();
      console.log("Match created successfully:", data);

      // Redirect to the new match page
      router.push(`/match/${data.gameId}`);
    } catch (error) {
      console.error("Error creating match:", error);
      // Here you might want to show an error message to the user
    }
  };

  const getFilteredTeams = (index: number) => {
    return teams.filter((team) => {
      // Check if this team is already selected
      const isTeamSelected = selectedTeams.some(
        (selectedTeam, i) => i !== index && selectedTeam?.id === team.id
      );

      // Check if any player from this team is already selected in another team
      const isPlayerSelected = team.playerIds.some((playerId) =>
        selectedTeams.some(
          (selectedTeam, i) =>
            i !== index && selectedTeam?.playerIds.includes(playerId)
        )
      );

      return !isTeamSelected && !isPlayerSelected;
    });
  };

  const isFormValid = () => {
    return (
      matchName.trim() !== "" &&
      matchDescription.trim() !== "" &&
      selectedTeams.every((team) => team !== null)
    );
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
        >
          Skapa ny match
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Namn"
            value={matchName}
            onChange={(e) => setMatchName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Beskrivning"
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
                    <Typography
                      variant="body2"
                    >
                      {option.concatenatedName}
                    </Typography>
                  </Box>
                </li>
              )}
              value={team}
              onChange={(_, newValue) => handleTeamChange(index, newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label={`Lag ${index + 1}`}
                  margin="normal"
                  required
                />
              )}
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
          <Button className="button"
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
