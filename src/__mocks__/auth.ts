// Storybook mock of src/auth.ts, registered with sb.mock() in .storybook/preview.tsx.
// Stories that need a logged in user override it with mocked(auth).mockResolvedValue(session).
import {fn} from "storybook/test";
import type {Session} from "next-auth";

export const auth = fn(async (): Promise<Session | null> => null).mockName("auth");
export const signIn = fn().mockName("signIn");
export const signOut = fn().mockName("signOut");
export const handlers = {GET: fn(), POST: fn()};
