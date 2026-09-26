import React from "react";
import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import ScoreboardDemo from "@/stories/scoreboard/ScoreboardDemo";
import type {ScoreboardProps} from "@/components/match/scoreboard/shared";
import ArenaScoreboard from "@/components/match/scoreboard/ArenaScoreboard";
import SplitFlapScoreboard from "@/components/match/scoreboard/SplitFlapScoreboard";
import RaceTrackScoreboard from "@/components/match/scoreboard/RaceTrackScoreboard";
import PodiumScoreboard from "@/components/match/scoreboard/PodiumScoreboard";
import TimingTowerScoreboard from "@/components/match/scoreboard/TimingTowerScoreboard";
import BroadcastScoreboard from "@/components/match/scoreboard/BroadcastScoreboard";
import MahjongTileScoreboard from "@/components/match/scoreboard/MahjongTileScoreboard";
import PotDonutScoreboard from "@/components/match/scoreboard/PotDonutScoreboard";
import ChampionScoreboard from "@/components/match/scoreboard/ChampionScoreboard";
import ArcadeScoreboard from "@/components/match/scoreboard/ArcadeScoreboard";

const CONCEPTS: [string, React.ComponentType<ScoreboardProps>][] = [
    ["01 Arena", ArenaScoreboard],
    ["02 Split-flap", SplitFlapScoreboard],
    ["03 Kapplöpning", RaceTrackScoreboard],
    ["04 Podium", PodiumScoreboard],
    ["05 F1-tornet", TimingTowerScoreboard],
    ["06 TV-sändning", BroadcastScoreboard],
    ["07 Mahjongbrickor", MahjongTileScoreboard],
    ["08 Potten", PotDonutScoreboard],
    ["09 Mästaren", ChampionScoreboard],
    ["10 Arkad", ArcadeScoreboard],
];

function Gallery({mode}: { readonly mode: "live" | "final" }) {
    return (
        <div style={{display: "grid", gap: 40}}>
            {CONCEPTS.map(([name, scoreboard]) => (
                <section key={name}>
                    <h2 style={{marginBottom: 12}}>{name}</h2>
                    <ScoreboardDemo scoreboard={scoreboard} mode={mode}/>
                </section>
            ))}
        </div>
    );
}

const meta = {
    title: "Poängtavla (koncept)/00 Alla koncept",
    component: Gallery,
    args: {mode: "live"},
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Live: Story = {};

export const Slutresultat: Story = {args: {mode: "final"}};
