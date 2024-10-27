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
import ReactEcharts from "echarts-for-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width:768px)");

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const options: any = {
    graphic: {
      elements: [
        {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: 'Mahjong Master System 4.0',
            fontSize: 24,
            lineDash: [0, 200],
            lineDashOffset: 0,
            fill: 'transparent',
            stroke: '#fff',
            lineWidth: 1
          },
          keyframeAnimation: {
            duration: 1000,
            loop: false,
            keyframes: [
              {
                percent: 0.7,
                style: {
                  fill: 'transparent',
                  lineDashOffset: 200,
                  lineDash: [200, 0]
                }
              },
              {
                // Stop for a while.
                percent: 0.8,
                style: {
                  fill: 'transparent'
                }
              },
              {
                percent: 1,
                style: {
                  fill: 'white'
                }
              }
            ]
          }
        }
      ]
    }
  };

  return (
    <AppBar
      position="static"
      className="header-bar"
      sx={{
        background:
          "radial-gradient(circle farthest-corner at 100px 100px, var(--gradient-start) 0% , var(--gradient-end) 100%)",
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
              {isLargeScreen && (
                <Image
                  src="/mahjong_tiles.png"
                  alt="Mahjong Tiles"
                  width={104}
                  height={52}
                  className="header-logo"
                />
              )}
              <ReactEcharts
                  option={options}
                  style={{ height: "64px", width: "350px" }}
              />
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
          <Link
              href="/scorecalculator"
              passHref
          >
            <Typography variant="body1">poängräknare</Typography>
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
