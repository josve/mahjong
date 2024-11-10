"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Box,
} from "@mui/material";
import {Session} from "next-auth";

interface Props {
  readonly session: Session | null;
}

export default function HeaderClient({ session }: Props) {
  return (
      <AppBar
          position="static"
          className="header-bar"
          sx={{
            position: "fixed",
            zIndex: 999,
            top: "0",
            background:
                "radial-gradient(circle farthest-corner at 100px 100px, var(--gradient-start) 0% , var(--gradient-end) 100%)",
            boxShadow: 0,
          }}
      >
        <Toolbar>
          <Box sx={{display: "flex", alignItems: "center", flexGrow: 1}}>
            <Link
                href="/"
                passHref
            >
              <Box
                  sx={{display: "flex", alignItems: "center", cursor: "pointer"}}
              >
                <Image
                    src="/mahjong_tiles.png"
                    alt="Mahjong Tiles"
                    className="header-logo"
                    width="300"
                    height="200"
                />
                <div className="header-title">
                  <span style={{fontWeight: "700"}}>Mahjong</span> Master System
                  4.0
                </div>
              </Box>
            </Link>
          </Box>
          <Box className="header-links header-text">
            <Link className="header-link"
                  href="/"
                  title="matcher"
                  passHref
            >
              matcher
            </Link>
            <Link className="header-link"
                  href="/statistics"
                  title="statistik"
                  passHref
            >
              statistik
            </Link>
            <Link className="header-link"
                  href="/scoreboard"
                  title="poängtabell"
                  passHref
            >
              poängtabell
            </Link>
            <Link className="header-link"
                  href="/scorecalculator"
                  title="poängräknare"
                  passHref
            >
              poängräknare
            </Link>
            {!session?.user &&
                <Link className="header-link"
                      href="/api/auth/signin"
                      title="Logga in"
                      passHref
                >
                  Logga in
                </Link>
            }
            {session?.user && (
                <>
                  <Link className="header-link"
                        href="/profile"
                        title={session.user.name}
                        passHref
                  >
                    {session.user.name}
                  </Link>
                </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
  );
}
