import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import ScoreCalculatorPage from "@/app/scorecalculator/page";

const meta = {
    title: "Pages/Poängräknare",
    component: ScoreCalculatorPage,
    parameters: {
        layout: "fullscreen",
        appLayout: {session: null},
        nextjs: {navigation: {pathname: "/scorecalculator"}},
    },
} satisfies Meta<typeof ScoreCalculatorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
