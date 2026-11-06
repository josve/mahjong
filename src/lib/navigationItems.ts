import CasinoOutlinedIcon from "@mui/icons-material/CasinoOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import AlarmIcon from '@mui/icons-material/Alarm';
import { Session } from "next-auth";
import type {SvgIconComponent} from "@mui/icons-material";
import type {useTranslations} from "next-intl";

type NavigationTranslator = ReturnType<typeof useTranslations<"navigation">>;

export interface NavigationItem {
    label: string;
    href: string;
    icon: SvgIconComponent;
    auth?: "guest" | "authenticated" | "both"; // Determines visibility based on authentication
}

/**
 * Generates navigation items based on the user's session.
 * @param session The current user session.
 * @param t Translator for the navigation namespace, from useTranslations("navigation").
 * @returns An array of navigation items.
 */
export function getNavigationItems(session: Session | null, t: NavigationTranslator): NavigationItem[] {
    const items: NavigationItem[] = [
        {
            label: t("matches"),
            href: "/",
            icon: CasinoOutlinedIcon,
            auth: "both",
        },
        {
            label: t("statistics"),
            href: "/statistics",
            icon: TrendingUpOutlinedIcon,
            auth: "both",
        },
        {
            label: t("scoreboard"),
            href: "/scoreboard",
            icon: TableChartOutlinedIcon,
            auth: "both",
        },
        {
            label: t("scoreCalculator"),
            href: "/scorecalculator",
            icon: CalculateOutlinedIcon,
            auth: "both",
        },
        {
            label: t("upcomingGames"),
            href: "/upcomingGames",
            icon: AlarmIcon,
            auth: "both",
        },
        {
            label: session?.user?.name || t("profile"),
            href: "/profile",
            icon: Person2OutlinedIcon,
            auth: "authenticated",
        },
        {
            label: t("signIn"),
            href: "/api/auth/signin",
            icon: LoginOutlinedIcon,
            auth: "guest",
        }
    ];

    return items;
}