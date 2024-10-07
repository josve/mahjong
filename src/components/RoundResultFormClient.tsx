"use client";

import React, { useState } from "react";

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
    <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
      {Object.entries(teamIdToName).map(([teamId, teamName]) => (
        <div key={teamId}>
          <label>
            {teamName} Score:
            <input
              type="number"
              value={formData.scores[teamId]}
              onChange={(e) => handleScoreChange(e, teamId)}
            />
          </label>
        </div>
      ))}
      <div>
        <label>
          East Team:
          <select
            name="eastTeam"
            value={formData.eastTeam}
            onChange={handleChange}
          >
            <option value="">Select East Team</option>
            {Object.entries(teamIdToName).map(([teamId, teamName]) => (
              <option key={teamId} value={teamId}>
                {teamName}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Winner:
          <select
            name="winner"
            value={formData.winner}
            onChange={handleChange}
          >
            <option value="">Select Winner</option>
            {Object.entries(teamIdToName).map(([teamId, teamName]) => (
              <option key={teamId} value={teamId}>
                {teamName}
              </option>
            ))}
            <option value="none">No Winner</option>
          </select>
        </label>
      </div>
      <button type="submit" disabled={!isFormValid()}>
        Add Result
      </button>
    </form>
  );
}
