import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import ScoreboardPage from "@/app/scoreboard/page";

const meta = {
    title: "Pages/Poängtabell",
    component: ScoreboardPage,
    parameters: {
        layout: "fullscreen",
        appLayout: {session: null},
        nextjs: {navigation: {pathname: "/scoreboard"}},
    },
} satisfies Meta<typeof ScoreboardPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
