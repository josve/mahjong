import {getRequestConfig} from "next-intl/server";
import messages from "../../messages/sv.json";

/**
 * The app is only available in Swedish. All texts live in messages/sv.json,
 * and this config just hands that file to next-intl for every request.
 */
export const locale = "sv";
export const timeZone = "Europe/Stockholm";

export default getRequestConfig(async () => ({
    locale,
    timeZone,
    messages,
}));
