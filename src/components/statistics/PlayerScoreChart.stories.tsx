import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import PlayerScoreChart from "@/components/statistics/PlayerScoreChart";
import {statisticsResponse} from "@/stories/fixtures";

const meta = {
    title: "Components/Statistics/PlayerScoreChart",
    component: PlayerScoreChart,
    args: {
        matches: statisticsResponse.matches,
        teamIdToName: statisticsResponse.teamIdToName,
        teamIdToPlayerIds: statisticsResponse.teamIdToPlayerIds,
        allTeamsAndPlayers: statisticsResponse.allTeamsAndPlayers,
        teamAndPlayerColors: statisticsResponse.teamAndPlayerColors,
        period: "all",
        includeTeams: false,
    },
    argTypes: {
        period: {control: "inline-radio", options: ["all", "new", "year"]},
    },
} satisfies Meta<typeof PlayerScoreChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllTime: Story = {};

export const CurrentYearWithTeams: Story = {
    args: {period: "year", includeTeams: true},
};
