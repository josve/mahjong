import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import MatchGridItemClient from "@/components/matches/MatchGridItemClient";
import {activeMatch, limitHandMatch, oldMatch, teamIdToName} from "@/stories/fixtures";

const meta = {
    title: "Components/Matches/MatchGridItemClient",
    component: MatchGridItemClient,
    decorators: [(Story) => <div style={{maxWidth: 560}}><Story/></div>],
    args: {
        index: 10,
        match: oldMatch,
        idToName: teamIdToName,
    },
} satisfies Meta<typeof MatchGridItemClient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Finished: Story = {};

export const Active: Story = {
    args: {index: 12, match: activeMatch},
};

export const WithLimitHand: Story = {
    args: {index: 11, match: limitHandMatch},
};
