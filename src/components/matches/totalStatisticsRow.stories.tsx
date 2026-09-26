import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import {mocked} from "storybook/test";
import TotalStatisticsRow from "@/components/matches/totalStatisticsRow";
import {getTotalStatistics} from "@/lib/dbMatch";

// Async server component; data comes from the mocked src/lib/dbMatch.ts.
const meta = {
    title: "Components/Matches/TotalStatisticsRow (server)",
    component: TotalStatisticsRow,
} satisfies Meta<typeof TotalStatisticsRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FirstMatch: Story = {
    beforeEach() {
        mocked(getTotalStatistics).mockResolvedValue({totalMatches: 1, totalMahjongs: 7, totalRounds: 9});
    },
};
