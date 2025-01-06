import CasinoOutlinedIcon from "@mui/icons-material/CasinoOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import AlarmIcon from '@mui/icons-material/Alarm';
import { Session } from "next-auth";
import {SvgIconComponent} from "@mui/icons-material";

export interface NavigationItem {
    label: string;
    href: string;
    icon: SvgIconComponent;
    auth?: "guest" | "authenticated" | "both"; // Determines visibility based on authentication
}

/**
 * Generates navigation items based on the user's session.
 * @param session The current user session.
 * @returns An array of navigation items.
 */
export function getNavigationItems(session: Session | null): NavigationItem[] {
    const items: NavigationItem[] = [
        {
            label: "Matcher",
            href: "/",
            icon: CasinoOutlinedIcon,
            auth: "both",
        },
        {
            label: "Statistik",
            href: "/statistics",
            icon: TrendingUpOutlinedIcon,
            auth: "both",
        },
        {
            label: "Poängtabell",
            href: "/scoreboard",
            icon: TableChartOutlinedIcon,
            auth: "both",
        },
        {
            label: "Poängräknare",
            href: "/scorecalculator",
            icon: CalculateOutlinedIcon,
            auth: "both",
        },
        {
            label: "Kommande matcher",
            href: "/upcomingGames",
            icon: AlarmIcon,
            auth: "both",
        },
        {
            label: session?.user?.name || "Spelare",
            href: "/profile",
            icon: Person2OutlinedIcon,
            auth: "authenticated",
        },
        {
            label: "Logga in",
            href: "/api/auth/signin",
            icon: LoginOutlinedIcon,
            auth: "guest",
        }
    ];

    return items;
}