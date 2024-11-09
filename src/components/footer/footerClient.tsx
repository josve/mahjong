import React from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Link from "next/link";

export default function FooterClient() {
  const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      className="footer"
    >
      <BottomNavigationAction
        label="Matcher"
        icon={<RestoreIcon />}
        component={Link}
        href="/public"
      />
      <BottomNavigationAction
        label="Statistik"
        icon={<FavoriteIcon />}
        component={Link}
        href="/statistics"
      />
      <BottomNavigationAction
        label="Poängtabell"
        icon={<LocationOnIcon />}
        component={Link}
        href="/scoreboard"
      />
      <BottomNavigationAction
        label="Poängräknare"
        icon={<LocationOnIcon />}
        component={Link}
        href="/scorecalculator"
      />
    </BottomNavigation>
  );
}
