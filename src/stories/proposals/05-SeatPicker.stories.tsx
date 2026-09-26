import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import SeatPicker from "@/components/proposals/SeatPicker";
import {allTeams} from "@/stories/proposals/data";

const meta = {
    title: "Förbättringsförslag/05 Visuell platsväljare",
    component: SeatPicker,
    args: {
        teams: allTeams,
        suggestions: [["t1", "t2", "t3", "t4"], ["t5", "t6", "t-ab", "t-cd"]],
    },
} satisfies Meta<typeof SeatPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tom: Story = {};

export const TreValda: Story = {args: {initialSeats: ["t1", "t3", "t5", null]}};

export const Klar: Story = {args: {initialSeats: ["t1", "t3", "t5", "t2"]}};
