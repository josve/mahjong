import type {StorybookConfig} from "@storybook/nextjs-vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
    addons: ["@storybook/addon-docs"],
    framework: {
        name: "@storybook/nextjs-vite",
        options: {},
    },
    features: {
        // Lets stories render async server components (pages, header, etc.).
        experimentalRSC: true,
    },
    staticDirs: ["../public"],
};

export default config;
