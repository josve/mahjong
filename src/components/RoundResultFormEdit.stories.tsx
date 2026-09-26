import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import RoundResultFormEdit from "@/components/RoundResultFormEdit";
import {activeMatch, handsForRound, relevantTeams} from "@/stories/fixtures";

const meta = {
    title: "Components/RoundResultFormEdit",
    component: RoundResultFormEdit,
    args: {
        round: "5",
        hands: handsForRound(activeMatch, 5),
        matchId: activeMatch.GAME_ID,
        teamIdToName: relevantTeams(activeMatch),
    },
} satisfies Meta<typeof RoundResultFormEdit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const UpdateFails: Story = {
    parameters: {
        fetchMocks: [{url: "/api/updateResult", method: "POST", status: 500, response: "not json"}],
    },
};
