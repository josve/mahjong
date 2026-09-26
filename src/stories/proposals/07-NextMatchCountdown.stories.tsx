import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import NextMatchCountdown from "@/components/proposals/NextMatchCountdown";
import {soloTeams} from "@/stories/proposals/data";

const HOUR = 3600000;

const meta = {
    title: "Förbättringsförslag/07 Nedräkning till nästa match",
    component: NextMatchCountdown,
    args: {
        gameTime: new Date(Date.now() + 2 * 24 * HOUR + 5 * HOUR + 17 * 60000),
        meetingLink: "https://meet.example.com/mahjong",
        attendees: [
            {player: soloTeams[0], rsvp: "yes"},
            {player: soloTeams[1], rsvp: "yes"},
            {player: soloTeams[2], rsvp: "yes"},
            {player: soloTeams[3], rsvp: "maybe"},
            {player: soloTeams[4], rsvp: "no"},
        ],
    },
} satisfies Meta<typeof NextMatchCountdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const JagKommer: Story = {args: {myRsvp: "yes"}};

export const UtanMoteslank: Story = {args: {meetingLink: null}};
