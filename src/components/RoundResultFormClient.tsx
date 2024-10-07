"use client";

import React, { useState } from "react";

export default function RoundResultFormClient({ teamIdToName }: { teamIdToName: { [key: string]: string } }) {
  const [formData, setFormData] = useState({
    teamId: "",
    score: "",
    isWinner: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
      <div>
        <label>
          Team ID:
          <select name="teamId" value={formData.teamId} onChange={handleChange}>
            <option value="">Select a team</option>
            <option value="">Select a team</option>
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
          Score:
          <input
            type="number"
            name="score"
            value={formData.score}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Winner:
          <input
            type="checkbox"
            name="isWinner"
            checked={formData.isWinner}
            onChange={handleChange}
          />
        </label>
      </div>
      <button type="submit">Add Result</button>
    </form>
  );
}
