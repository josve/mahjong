import React from "react";
import Link from "next/link";
interface StatisticsNavProps {
  currentPath: string;
}

const StatisticsNav: React.FC<StatisticsNavProps> = ({ currentPath }) => {

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
              textDecoration: currentPath === link.path ? "underline" : "none",
              fontWeight: currentPath === link.path ? "bold" : "normal",
              color: currentPath === link.path ? "#943030" : "black",
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
