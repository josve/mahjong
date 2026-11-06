import type {StorybookConfig} from "@storybook/nextjs-vite";
import {fileURLToPath} from "node:url";

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
    viteFinal(viteConfig) {
        // Server components call getTranslations() from "next-intl/server", which only works inside
        // a Next.js request. In stories it is replaced by a version that reads messages/sv.json directly.
        viteConfig.resolve ??= {};
        viteConfig.resolve.alias = [
            {
                find: /^next-intl\/server$/,
                replacement: fileURLToPath(new URL("../src/stories/nextIntlServer.ts", import.meta.url)),
            },
            ...(Array.isArray(viteConfig.resolve.alias)
                ? viteConfig.resolve.alias
                : Object.entries(viteConfig.resolve.alias ?? {}).map(([find, replacement]) => ({find, replacement}))),
        ];
        return viteConfig;
    },
};

export default config;
