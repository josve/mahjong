"use client";

import Image from "next/image";
import Link from "next/link";
import { AppBar, Toolbar, Typography, Box, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <AppBar
      position="static"
      className="header-bar"
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
                width={104}
                height={52}
              />
              <Typography
                variant="h6"
                className="header-text"
              >
                <span className="bold-header">Mahjong</span> Master System 4.0
              </Typography>
            </Box>
          </Link>
        </Box>
        <Box className="header-links">
          <Link
            href="/"
            passHref
          >
            <Typography variant="body1">matcher</Typography>
          </Link>
          <Link
            href="/statistics"
            passHref
          >
            <Typography variant="body1">statistik</Typography>
          </Link>
          <Link
            href="/scoreboard"
            passHref
          >
            <Typography variant="body1">poängtabell</Typography>
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
          <ListItem button component={Link} href="/" onClick={handleMenuToggle}>
            <ListItemText primary="matcher" />
          </ListItem>
          <ListItem button component={Link} href="/statistics" onClick={handleMenuToggle}>
            <ListItemText primary="statistik" />
          </ListItem>
          <ListItem button component={Link} href="/scoreboard" onClick={handleMenuToggle}>
            <ListItemText primary="poängtabell" />
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
}
