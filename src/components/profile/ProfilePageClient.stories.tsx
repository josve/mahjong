import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import ProfilePageClient from "@/components/profile/ProfilePageClient";
import {playerColors, session, teamDetails} from "@/stories/fixtures";

const meta = {
    title: "Components/Profile/ProfilePageClient",
    component: ProfilePageClient,
    args: {
        session,
        teamDetails,
        playerColors,
    },
} satisfies Meta<typeof ProfilePageClient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PlayerWithoutTeams: Story = {
    args: {
        session: {
            ...session,
            user: {...session.user, PLAYER_ID: "p5", playerId: "p5", NAME: "Erik", name: "Erik", firstInitial: "E",
                COLOR_RED: 140, COLOR_GREEN: 80, COLOR_BLUE: 190, SHOW_PREVIOUS_ROUND_SCORE: true},
        },
    },
};
