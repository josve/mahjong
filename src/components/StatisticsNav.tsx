import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const StatisticsNav: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { path: "/statistics/all", label: "All tid" },
    { path: "/statistics/new", label: "Ny tid" },
    { path: "/statistics/year", label: "Nuvarande år" },
  ];

  return (
    <nav style={{ marginBottom: "20px" }}>
      {links.map((link) => (
        <Link key={link.path} href={link.path} passHref>
          <a
            style={{
              marginRight: "15px",
              textDecoration: pathname === link.path ? "underline" : "none",
              fontWeight: pathname === link.path ? "bold" : "normal",
              color: pathname === link.path ? "#943030" : "black",
            }}
          >
            {link.label}
          </a>
        </Link>
      ))}
    </nav>
  );
};

export default StatisticsNav;
