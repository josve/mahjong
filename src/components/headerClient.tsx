"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

export default function HeaderClient({ session }: { readonly session: any }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <AppBar
      position="static"
      className="header-bar"
      sx={{
        background:
          "radial-gradient(circle farthest-corner at 100px 100px, var(--gradient-start) 0% , var(--gradient-end) 100%)",
          boxShadow: 0,
      }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Link
            href="/"
            passHref
          >
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
        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuToggle}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={handleMenuToggle}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <List>
          <ListItem
            component={Link}
            href="/"
            onClick={handleMenuToggle}
          >
            <ListItemText primary="Matcher" />
          </ListItem>
          <ListItem
            component={Link}
            href="/statistics"
            onClick={handleMenuToggle}
          >
            <ListItemText primary="Statistik" />
          </ListItem>
          <ListItem
            component={Link}
            href="/scoreboard"
            onClick={handleMenuToggle}
          >
            <ListItemText primary="Poängtabell" />
          </ListItem>
          <ListItem
              component={Link}
              href="/scorecalculator"
              onClick={handleMenuToggle}
          >
            <ListItemText primary="Poängräknare" />
          </ListItem>
          {session?.user && (
            <ListItem
              component={Link}
              href="/profile"
              onClick={handleMenuToggle}
            >
              <ListItemText primary="Profil" />
            </ListItem>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
}
