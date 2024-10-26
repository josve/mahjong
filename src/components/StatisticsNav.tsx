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
    <nav>
      {links.map((link) => (
        <Link
          key={link.path}
          href={link.path}
          className={
            currentPath === link.path ? "selected-statistics" : undefined
          }
          style={{
            marginRight: "15px",
          }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default StatisticsNav;
