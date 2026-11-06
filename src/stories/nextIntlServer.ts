// Storybook replacement for "next-intl/server" (aliased in .storybook/main.ts).
// The real module needs the Next.js request context, which async server components
// rendered in stories don't have, so translations are created directly from messages/sv.json.
import {createTranslator} from "next-intl";
import messages from "../../messages/sv.json";
import {locale, timeZone} from "@/i18n/request";

export async function getTranslations(namespace?: string) {
    return createTranslator({locale, timeZone, messages, namespace: namespace as never});
}

export async function getLocale() {
    return locale;
}

export async function getMessages() {
    return messages;
}

export async function getTimeZone() {
    return timeZone;
}

export function getRequestConfig<T>(config: T): T {
    return config;
}
