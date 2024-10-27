"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width:768px)");

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
            passHref
          >
            matcher
          </Link>
          <Link className="header-link"
            href="/statistics"
            passHref
          >
            statistik
          </Link>
          <Link className="header-link"
            href="/scoreboard"
            passHref
          >
            poängtabell
          </Link>
          <Link className="header-link"
              href="/scorecalculator"
              passHref
          >
            poängräknare
          </Link>
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
        </List>
      </Drawer>
    </AppBar>
  );
}
