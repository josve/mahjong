import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import {mocked} from "storybook/test";
import StatisticsPage from "@/app/statistics/page";
import fetchMatches from "@/lib/fetchMatches";
import {matchesAsc} from "@/stories/fixtures";

const meta = {
    title: "Pages/Statistik",
    component: StatisticsPage,
    parameters: {
        layout: "fullscreen",
        appLayout: {session: null},
        nextjs: {navigation: {pathname: "/statistics"}},
    },
} satisfies Meta<typeof StatisticsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FewMatches: Story = {
    beforeEach() {
        mocked(fetchMatches).mockResolvedValue(matchesAsc.slice(-2));
    },
};
