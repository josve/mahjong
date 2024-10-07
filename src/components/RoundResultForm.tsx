import React from "react";
import RoundResultFormClient from "./RoundResultFormClient";

export default function RoundResultForm({ teamIdToName, matchId }: { teamIdToName: { [key: string]: string }, matchId: string }) {
  return <RoundResultFormClient teamIdToName={teamIdToName} matchId={matchId} />;
}
