import React from "react";
import RoundResultFormClient from "./RoundResultFormClient";

export default function RoundResultForm({ teamIdToName }: { teamIdToName: { [key: string]: string } }) {
  return <RoundResultFormClient teamIdToName={teamIdToName} />;
}
