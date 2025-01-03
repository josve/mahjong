"use client";
import React, {useEffect, useState} from "react";
import ReactEcharts from "echarts-for-react";
import {Box, Button, CircularProgress, Typography} from "@mui/material";
import {capitalize, formatDate} from "@/lib/formatting";
import {MatchChartResponse} from "@/types/api";
import {Hand, TeamIdToPlayerIds} from "@/types/db";
import {HandWithScore} from "@/types/components";
import {EChartsOption} from "echarts-for-react/src/types";
import Confetti from 'react-confetti'
import LastRoundDisplay from "@/components/match/LastRoundDisplay";

interface Props {
  readonly matchId: string;
  readonly autoReload: boolean;
  readonly showPreviousRoundScore: boolean;
  readonly teamIdToPlayerIds: TeamIdToPlayerIds;
  readonly playerId: string | undefined;
  readonly isEditable: boolean;
}

export interface Round {
  hands: Hand[];
  previousHand?: Hand[];
  maxHand: number;
  maxScore: number;
}

export default function MatchChartClient({
                                           matchId,
                                           autoReload,
                                           showPreviousRoundScore,
                                           teamIdToPlayerIds,
                                           playerId,
                                           isEditable,
                                         }: Props) {
  const [data, setData] = useState<MatchChartResponse | null>(null);
  const [lastRoundCount, setLastRoundCount] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [handsToShow, setHandsToShow] = useState<Round>({hands: [], maxHand: 0, maxScore: 0});
  const [showAllRounds, setShowAllRounds] = useState<boolean>(false);
  const [allHandsExceptFirst, setAllHandsExceptFirst] = useState<Round[]>([]);

  const toggleShowAllRounds = () => {
    setShowAllRounds(!showAllRounds);
  };

  useEffect(() => {
    const hands = data?.hands;
    if (hands && hands.length > 4) {
      // Exclude the first 4 hands
      const handsToProcess = hands.slice(4);

      let maxHand = 0;
      let maxScore = 0;
      for (const hand of handsToProcess) {
        if (hand.HAND > maxHand) {
          maxHand = hand.HAND;
        }
        if (hand.HAND_SCORE > maxScore) {
          maxScore = hand.HAND_SCORE;
        }
      }

      // Function to sort a ROUND by TEAM_ID
      const sortByPlayerId = (a: Hand, b: Hand) => {
        if (a.TEAM_ID < b.TEAM_ID) return -1;
        if (a.TEAM_ID > b.TEAM_ID) return 1;
        return 0;
      };

      const result: Round[] = [];

      let prevHand: Hand[] | undefined = undefined;

      // Process hands in batches of 4 (each ROUND)
      for (let i = 0; i < handsToProcess.length; i += 4) {
        // Slice out a ROUND (4 hands)
        const round = handsToProcess.slice(i, i + 4);

        // Sort the ROUND by TEAM_ID
        const sortedRound = [...round].sort(sortByPlayerId);

        // Push the sorted ROUND into the result
        result.push({
          hands: sortedRound,
          previousHand: prevHand,
          maxScore: maxScore,
          maxHand: maxHand,
        });

        prevHand = sortedRound;
      }

      // Reverse the result array if needed
      result.reverse();

      // Update the state
      setAllHandsExceptFirst(result);
    }
  }, [data]);


  useEffect(() => {

    if (allHandsExceptFirst && allHandsExceptFirst.length > 0) {
      setHandsToShow(allHandsExceptFirst[0]);
    }

  }, [allHandsExceptFirst]);

  useEffect(() => {
    if (isEditable && handsToShow) {
      let winner: string | null = null;
      for (const hand of handsToShow.hands) {
        if (hand.IS_WINNER) {
          winner = hand.TEAM_ID;
        }
      }
      if (winner) {
        let showConfetti = false;
        if (winner == playerId) {
          showConfetti = true;
        } else {
          const playerIds = teamIdToPlayerIds[winner];
          if (playerIds) {
            for (const teamPlayerId of playerIds) {
              if (teamPlayerId == playerId) {
                showConfetti = true;
              }
            }
          }
        }
        setShowConfetti(showConfetti);
      }
    }
  }, [handsToShow]);

  const fetchData = async () => {
    const response = await fetch(`/api/matchChart?matchId=${matchId}`);
    const data: MatchChartResponse = await response.json();
    setData(data);
    setLastRoundCount(data.hands.length);
  };

  useEffect(() => {
    fetchData();
  }, [matchId]);

  useEffect(() => {
    if (autoReload) {
      const interval = setInterval(async () => {
        const response = await fetch(`/api/matchChart?matchId=${matchId}`);
        const newData: MatchChartResponse = await response.json();
        if (newData.hands.length > lastRoundCount) {
          setData(newData);
          setLastRoundCount(newData.hands.length);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [autoReload, matchId, lastRoundCount]);

  if (!data) {
    return <Box
        sx={{
          display: 'fixed',
          top: "0",
          left: "0",
          margin: "0",
          padding: "0",
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 150px)',
          width: 'calc(100vw - 50px)',
        }}
    ><CircularProgress/>
    </Box>;
  }

  const {hands, teamIdToName, teamColors} = data;

  // Get the hands for each team
  const teamHands = hands.reduce((acc: {
    [teamId: string]: HandWithScore[];
  }, hand: Hand) => {
    acc[hand.TEAM_ID] = acc[hand.TEAM_ID] || [];
    acc[hand.TEAM_ID].push(hand);
    return acc;
  }, {});

  // For each team, sum the HAND_SCORE for each round and add to the hands objects
  for (const teamId in teamHands) {
    const teamHand = teamHands[teamId];
    let totalScore = 0;
    for (const item of teamHand) {
      totalScore += item.HAND_SCORE;
      item.SCORE = totalScore;
    }
  }

  const numRounds = Math.floor(hands.length / 4 - 1);

  const roundsToShow = Math.max(15, numRounds + 5);

  // Initialize rounds starting from 1
  const rounds = Array.from({length: roundsToShow}, (_, i) =>
      (i + 1).toString()
  );

  const getTeamName = (teamId: string) => {
    return teamIdToName[teamId] || "Unknown Team";
  };

  let series = [];

  // Calculate the percentage of wins for each player
  const winCounts = hands.reduce((acc: {
    [teamId: string]: number
  }, hand: Hand) => {
    if (hand.IS_WINNER) {
      acc[hand.TEAM_ID] = (acc[hand.TEAM_ID] || 0) + 1;
    }
    return acc;
  }, {});

  // Add no-winner team for rounds with no IS_WINNER
  for (let i = 1; i < numRounds; i++) {
    const roundHands = hands.slice(i * 4, (i + 1) * 4);
    const hasWinner = roundHands.some((hand: Hand) => hand.IS_WINNER);
    if (!hasWinner) {
      winCounts["no-winner"] = (winCounts["no-winner"] || 0) + 1;
    }
  }

  const totalWins = numRounds;

  const pieData = Object.keys(winCounts).map((teamId) => ({
    value: winCounts[teamId],
    name: teamId === "no-winner" ? "No Winner" : getTeamName(teamId),
    label: {
      color: teamColors[teamId],
    },
    itemStyle: {
      borderColor: "white",
      borderWidth: 3,
      color:
          teamColors[teamId]
              ? `rgb(${teamColors[teamId].color_red}, ${teamColors[teamId].color_green}, ${teamColors[teamId].color_blue})`
              : "transparent", // Use transparent if no color is found
      formatter: (params: any) => {
        if (Array.isArray(params)) {
          return params
              .map((param) => {
                const teamName = getTeamName(param.seriesName);
                if (teamName !== "Unknown Team") {
                  const windHand = param.data.name.WIND_HAND;
                  const handScore = param.data.name.HAND_SCORE;
                  const isWinner = param.data.name.IS_WINNER;
                  const mahjongText = isWinner ? " mahjong" : "";
                  return `${teamName}: ${
                      param.value - 500
                  } (${windHand} HANDp${mahjongText}, ${handScore})`;
                }
                return null;
              })
              .filter((text) => text !== null)
              .join("<br/>");
        } else {
          const teamName = getTeamName(params.name);
          const percentage = ((params.value / totalWins) * 100).toFixed(2);
          return `${teamName}: ${params.value} wins (${percentage}%)`;
        }
      },
    },
  }));

  series.push({
    type: "pie",
    radius: ["14%", "22%"],
    center: ["10%", "18%"],
    data: pieData,
    tooltip: {
      show: false,
      splitLine: {
        show: true, // Show horizontal grid lines
      },
    },
    textStyle: {
      align: "left", // Align text to the left
    },
    label: {
      show: false,
      position: "center",
      emphasis: {
        show: true,
        formatter: "{b}: {c} ({d}%)",
        fontSize: 18,
        fontWeight: "bold",
      },
      textBorderWidth: 2,
      textBorderColor: "white",
    },
  });


  series.push({
    data: rounds.map(() => 500),
    type: "line",
    name: "Threshold",
    lineStyle: {
      color: "gray",
      type: [5, 5], //custom dash
      width: 1,
      splitLine: {
        show: true, // Show horizontal grid lines
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: true, // Show grid lines for y-axis
      },
    },
    symbol: "none",
    label: {
      show: false,
    },
  });


  for (const teamId in teamHands) {
    const color = teamColors[teamId]
        ? `rgb(${teamColors[teamId].color_red}, ${teamColors[teamId].color_green}, ${teamColors[teamId].color_blue})`
        : "black"; // Default color if no color is found


    const allRoundsForTeam = teamHands[teamId];

    const scores = allRoundsForTeam.map((round: HandWithScore) => {

      const currentRoundIndex = round.ROUND;
      const winnerRoundIndex = showPreviousRoundScore ? currentRoundIndex + 1 : currentRoundIndex;
      const winnerRound = allRoundsForTeam[winnerRoundIndex];
      const isWinner = winnerRound?.IS_WINNER;

      return {
        value: (round.SCORE ? round.SCORE : 0) + 500,
        name: round,
        itemStyle: {
          color: isWinner ? "white" : "transparent",
          borderColor: color, // Use line color
          borderWidth: isWinner ? 4 : 0,
          fontWeight: "bold", // Make the text bold
        }
      };
    });

    series.push({
      data: scores,
      type: "line",
      name: teamId,
      lineStyle: {
        color: color,
        width: 7, // Adjust the line thickness
        cap: "round",
      },
      smooth: 0.4,
      symbol: "circle",
      symbolSize: (ignore: any, params: any) => {
        return params.data.itemStyle.borderWidth == 4 ? 18 : 0; // Make the circles larger
      },
      endLabel: {
        show: true,
        position: "right",
        distance: 18,
        color: color,
        fontSize: 18,
        fontWeight: "bold",
        textBorderWidth: 2,
        textBorderColor: "white",
        formatter: (params: any) => {
          if (params.dataIndex === scores.length - 1) {
            return `${params.value} ${getTeamName(teamId)}`;
          }
        },
      },
    });
  }

  const options: EChartsOption = {
    animationDuration: "500",
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        if (params.some((param: any) => param.seriesType === "pie")) {
          return ""; // Hide tooltip when hovering over pie chart
        }

        const dataIndex = params[0].dataIndex;


        const scoreIndex = showPreviousRoundScore ? dataIndex + 1 : dataIndex;

        const scoreHands = hands.filter((hand: Hand) => hand.ROUND == scoreIndex);
        const showScore = showPreviousRoundScore ? scoreHands.length === 4 : params[0].dataIndex !== 0;


        return params
            .map((param: any) => {
              const teamName = getTeamName(param.seriesName);
              if (teamName !== "Unknown Team") {
                const color = teamColors[param.seriesName]
                    ? `rgb(${teamColors[param.seriesName].color_red}, ${
                        teamColors[param.seriesName].color_green
                    }, ${teamColors[param.seriesName].color_blue})`
                    : "black";

                if (showScore) {
                  const teamId = param.data.name.TEAM_ID;
                  const scoreHand = scoreHands.find((hand: Hand) => hand.TEAM_ID === teamId)!;
                  const windHand = scoreHand.WIND;
                  const hand = scoreHand.HAND + "p";
                  const handScore = scoreHand.HAND_SCORE;
                  const isWinner = scoreHand.IS_WINNER;
                  const mahjongText = isWinner ? " mahjong" : "";
                  const formattedHandScore =
                      handScore > 0 ? `+${handScore}` : handScore;
                  return `<span style="display:inline-block;width:10px;height:10px;background-color:${color};margin-right:5px;"></span>${teamName}: ${
                      param.value
                  } (${windHand} ${hand}${mahjongText}, ${formattedHandScore})`;
                } else {
                  return `<span style="display:inline-block;width:10px;height:10px;background-color:${color};margin-right:5px;"></span>${teamName}: ${
                      param.value
                  }`;
                }
              }
              return null;
            })
            .filter((text: any) => text !== null)
            .join("<br/>");
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: false,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: rounds,
      startValue: 0,
      axisLabel: {
        formatter: (value: string) => {
          const roundNumber = parseInt(value, 10);
          if ((roundNumber - 1) == 0) {
            return "";
          }

          const actualMatchLength = Math.floor(hands.length / 4);
          return roundNumber <= actualMatchLength ? roundNumber - 1 : "";
        },
      },
    },
    yAxis: {
      type: "value",
      min: (value: { min: number; }) => {
        return Math.min(0, Math.floor((value.min - 100) / 100) * 100);
      },
      max: (value: { min: number; max: number; }) => {
        const minValue = Math.min(0, Math.floor((value.min - 100) / 100) * 100);
        const maxValue = Math.ceil((value.max + 100) / 100) * 100;
        if (maxValue - minValue < 1000) {
          return maxValue + (1000 - Math.abs(minValue - maxValue));
        }
        return maxValue;
      },
      splitLine: {
        show: true, // Show grid lines for y-axis
      },
      axisLabel: {
        formatter: (value: number) => {
          return value.toString();
        },
      },
    },
    series: series,
  };

  return (
      <>
        {showConfetti && (
            <Confetti
                recycle={false}
            />)}

        <div>
          <div className="multi-title-header">
            <h1>{data?.match?.NAME}</h1>
            <h2 style={{textAlign: "left"}}>{numRounds} omgångar</h2>
          </div>
          <div className="label">
            {capitalize(formatDate(data?.match?.TIME))}
          </div>
          {data?.match?.COMMENT && (
              <div className="label">
                {data?.match?.COMMENT}
              </div>
          )}
        </div>

        <ReactEcharts
            option={options}
            style={{height: "600px"}}
        />
        {handsToShow && handsToShow.hands.length > 0 && !showAllRounds && (<>
          <Typography variant="h5" style={{paddingTop: 30}}>Senaste omgången</Typography>
          <LastRoundDisplay teamIdToName={data.teamIdToName} round={handsToShow}/>
          <Button style={{marginTop: 20}} variant="outlined" onClick={toggleShowAllRounds}>Visa alla omgångar</Button>
        </>)}
        {handsToShow && handsToShow.hands.length > 0 && showAllRounds && (<>
          <Typography variant="h5" style={{paddingTop: 30}}>Alla omgångar</Typography>
          {allHandsExceptFirst.map(((round) => (
              <Box style={{paddingTop: 10}}>
                <LastRoundDisplay teamIdToName={data.teamIdToName} round={round}/>
              </Box>
          )))}
          <Button style={{marginTop: 20}} variant="outlined" onClick={toggleShowAllRounds}>Visa bara senaste
            omgången</Button>
        </>)}
      </>
  );
}
