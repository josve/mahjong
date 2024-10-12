import React from "react";
import RoundResultFormClient from "./RoundResultFormClient";

export default function RoundResultForm({ teamIdToName, matchId, isEditMode = false }: { teamIdToName: { [key: string]: string }, matchId: string, isEditMode?: boolean }) {
  return <RoundResultFormClient teamIdToName={teamIdToName} matchId={matchId} isEditMode={isEditMode} />;
}
