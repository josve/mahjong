import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PlayerScoreChartProps {
  matches: any[];
  teamIdToName: { [key: string]: string };
}

const PlayerScoreChart: React.FC<PlayerScoreChartProps> = ({ matches, teamIdToName }) => {
  const playerScores: { [key: string]: number[] } = {};
  const labels: string[] = [];

  matches.forEach((match, index) => {
    const gameId = match.GAME_ID;
    labels.push(`Game ${index + 1}`);

    match.hands.forEach((hand: any) => {
      const teamName = teamIdToName[hand.TEAM_ID];
      const score = hand.HAND_SCORE / (teamName.includes('+') ? 2 : 1);

      if (!playerScores[teamName]) {
        playerScores[teamName] = [];
      }

      const previousScore = playerScores[teamName][index - 1] || 0;
      playerScores[teamName][index] = previousScore + score;
    });
  });

  const data = {
    labels,
    datasets: Object.entries(playerScores).map(([player, scores]) => ({
      label: player,
      data: scores,
      fill: false,
      borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    })),
  };

  return <Line data={data} />;
};

export default PlayerScoreChart;
