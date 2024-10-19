import Image from "next/image";
import Link from "next/link";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

export default function Header() {
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
      </Toolbar>
    </AppBar>
  );
}
