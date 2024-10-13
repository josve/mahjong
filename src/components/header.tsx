import Image from "next/image";
import Link from "next/link";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

export default function Header() {
  return (
    <AppBar
      position="static"
      style={{ background: "linear-gradient(to right, #db5a4c, #8a5331)" }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Link href="/" passHref>
            <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <Image
                src="/mahjong_tiles.png"
                alt="Mahjong Tiles"
                width={104}
                height={52}
              />
              <Typography
                variant="h6"
                style={{
                  marginLeft: "10px",
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "left"
                }}
              >
                <span style={{ fontWeight: "bold" }}>mahjong</span> master system 4.0
              </Typography>
            </Box>
          </Link>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", flexGrow: 1 }}>
          <Link
            href="/"
            passHref
          >
            <Typography
              variant="body1"
              style={{ color: "white", marginRight: "20px", cursor: "pointer" }}
            >
              matcher
            </Typography>
          </Link>
          <Link
            href="/statistics"
            passHref
          >
            <Typography
              variant="body1"
              style={{ color: "white", marginRight: "20px", cursor: "pointer" }}
            >
              statistik
            </Typography>
          </Link>
          <Link
            href="/scoreboard"
            passHref
          >
            <Typography
              variant="body1"
              style={{ color: "white", marginRight: "20px", cursor: "pointer" }}
            >
              poängtabell
            </Typography>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
