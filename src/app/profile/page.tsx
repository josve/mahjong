import { auth } from "@/auth";
import { useState } from "react";
import { TextField, Button, Checkbox, FormControlLabel, Snackbar, Alert } from "@mui/material";
import { ChromePicker } from "react-color";

export default async function ProfilePage() {
  const session = await auth();

  if (!session || !session.user) {
    return <p>Du måste vara inloggad för att se denna sida.</p>;
  }

  const user: any = session.user;

  const [color, setColor] = useState({
    r: user.COLOR_RED,
    g: user.COLOR_GREEN,
    b: user.COLOR_BLUE,
  });
  const [showPreviousRoundScore, setShowPreviousRoundScore] = useState(
    user.SHOW_PREVIOUS_ROUND_SCORE
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const handleColorChange = (color: any) => {
    setColor(color.rgb);
  };

  const handleCheckboxChange = (event: any) => {
    setShowPreviousRoundScore(event.target.checked);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const response = await fetch("/api/updateProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        color_red: color.r,
        color_green: color.g,
        color_blue: color.b,
        show_previous_round_score: showPreviousRoundScore,
      }),
    });

    if (response.ok) {
      setSnackbarMessage("Profile updated successfully!");
      setSnackbarSeverity("success");
    } else {
      setSnackbarMessage("Failed to update profile.");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{ backgroundColor: "var(--background-color)", padding: "20px" }}>
      <h1 style={{ color: "var(--header-color)" }}>Profil</h1>
      <p style={{ color: "var(--label_text-color)" }}>Namn: {user?.name}</p>
      <div>
        <p>Färg</p>
        <ChromePicker
          color={color}
          onChange={handleColorChange}
        />
      </div>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={showPreviousRoundScore}
              onChange={handleCheckboxChange}
            />
          }
          label="Visa föregående rundpoäng"
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        Uppdatera profil
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
