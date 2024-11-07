import React from "react";
import Link from "next/link";
interface StatisticsNavProps {
  currentPath: string;
}

const StatisticsNav: React.FC<StatisticsNavProps> = ({ currentPath }) => {
  const links = [
    { path: "/statistics", label: "Statistik" },
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
