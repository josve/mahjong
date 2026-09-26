import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import NewMatchClient from "@/components/newMatchClient";

const meta = {
    title: "Components/NewMatchClient",
    component: NewMatchClient,
} satisfies Meta<typeof NewMatchClient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoTeams: Story = {
    parameters: {
        fetchMocks: [{url: "/api/teams", response: []}],
    },
};
