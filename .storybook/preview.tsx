import React from "react";
import type {Preview} from "@storybook/nextjs-vite";
import {sb} from "storybook/test";
import Providers from "../src/components/Providers";
import AppLayout from "../src/stories/AppLayout";
import {installFetchMocks, type FetchMock} from "../src/stories/fetchMock";
import {defaultFetchMocks} from "../src/stories/apiMocks";
import "../src/app/globals.css";

// Server-side modules (database, next-auth) are replaced by the files in the
// adjacent __mocks__ folders, backed by the data in src/stories/fixtures.ts.
sb.mock(import("../src/lib/dbMatch.ts"));
sb.mock(import("../src/lib/fetchMatches.ts"));
sb.mock(import("../src/lib/db/upcomingGame.ts"));
sb.mock(import("../src/auth.ts"));

const preview: Preview = {
    parameters: {
        nextjs: {
            appDirectory: true,
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        layout: "padded",
    },
    decorators: [
        (Story, {parameters}) => {
            const content = parameters.appLayout
                ? <AppLayout session={parameters.appLayout.session ?? null}><Story/></AppLayout>
                : <Story/>;
            return <Providers>{content}</Providers>;
        },
    ],
    beforeEach({parameters}) {
        // Story specific API responses (parameters.fetchMocks) take precedence over the defaults.
        const fetchMocks: FetchMock[] = parameters.fetchMocks ?? [];
        return installFetchMocks([...fetchMocks, ...defaultFetchMocks]);
    },
};

export default preview;
