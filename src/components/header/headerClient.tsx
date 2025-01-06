// components/HeaderClient.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { AppBar, Toolbar, Box } from "@mui/material";
import { Session } from "next-auth";
import { getNavigationItems, NavigationItem } from "@/lib/navigationItems";

interface Props {
  readonly session: Session | null;
}

export default function HeaderClient({ session }: Props) {
  const navigationItems: NavigationItem[] = getNavigationItems(session);

  // Filter items to include both authenticated and guest links
  const visibleItems = navigationItems.filter((item) =>
      item.auth === "both" ||
      (item.auth === "authenticated" && session?.user) ||
      (item.auth === "guest" && !session?.user)
  );

  return (
      <AppBar
          position="static"
          className="header-bar"
          sx={{
            position: "fixed",
            zIndex: 999,
            top: "0",
            background:
                "radial-gradient(circle farthest-corner at 100px 100px, var(--gradient-start) 0%, var(--gradient-end) 100%)",
            boxShadow: 0,
          }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Link href="/" passHref>
              <Box
                  sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              >
                <Image
                    src="/mahjong_tiles.png"
                    alt="Mahjong Tiles"
                    className="header-logo"
                    width="300"
                    height="200"
                />
                <div className="header-title">
                  <span style={{ fontWeight: "700" }}>Mahjong</span> Master System
                  4.3
                </div>
              </Box>
            </Link>
          </Box>
          <Box className="header-links header-text">
            {visibleItems.map((item) => (
                <Link
                    key={item.label}
                    className="header-link"
                    href={item.href}
                    title={item.label}
                    passHref
                >
                  {item.label}
                </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
  );
}