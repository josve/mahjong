import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import UpcomingGameCard from "@/components/matches/UpcomingGameCard";
import {session, teamDetails, upcomingGames} from "@/stories/fixtures";

const meta = {
    title: "Components/Matches/UpcomingGameCard",
    component: UpcomingGameCard,
    decorators: [(Story) => <div style={{maxWidth: 560}}><Story/></div>],
    args: {
        upcomingGame: upcomingGames[0],
        session,
    },
} satisfies Meta<typeof UpcomingGameCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedInWithMeetingLink: Story = {};

export const LoggedOut: Story = {
    args: {session: null},
};

export const WithoutMeetingLink: Story = {
    args: {upcomingGame: upcomingGames[1]},
};

export const WithSuggestedTeams: Story = {
    args: {suggestedTeams: ["t-ab", "t3", "t4", "t5"].map((teamId) => teamDetails[teamId])},
};
