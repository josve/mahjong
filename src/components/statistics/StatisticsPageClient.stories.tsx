import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import StatisticsPageClient from "@/components/statistics/StatisticsPageClient";
import {statisticsResponse} from "@/stories/fixtures";

const meta = {
    title: "Components/Statistics/StatisticsPageClient",
    component: StatisticsPageClient,
    args: {data: statisticsResponse},
} satisfies Meta<typeof StatisticsPageClient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
