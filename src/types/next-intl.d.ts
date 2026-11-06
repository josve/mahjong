import messages from "../../messages/sv.json";
import {locale} from "@/i18n/request";

// Makes the message keys type checked: t("stats.title") fails to compile if the key is missing in sv.json.
declare module "next-intl" {
    interface AppConfig {
        Locale: typeof locale;
        Messages: typeof messages;
    }
}
