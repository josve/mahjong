// Helpers for controlling the module mocks in src/**/__mocks__ from stories.
import type {Mock} from "storybook/test";
import type {Session} from "next-auth";
import {auth} from "@/auth";

/** Makes the mocked `auth()` resolve to the given session (null = logged out). */
export function mockSession(session: Session | null) {
    (auth as unknown as Mock<() => Promise<Session | null>>).mockResolvedValue(session);
}

/**
 * Story annotations for a logged in user: shows the user in the app layout
 * and makes server components see the session through auth().
 */
export function loggedIn(user: Session) {
    return {
        parameters: {appLayout: {session: user}},
        beforeEach() {
            mockSession(user);
        },
    };
}
