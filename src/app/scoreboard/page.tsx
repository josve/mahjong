import React from "react";

export default function ScoreboardPage() {
  return (
    <div style={{ padding: "20px", fontFamily: "HelveticaNeueLight, Helvetica, Arial, sans-serif" }}>
      <h1 style={{ color: "#943030", fontSize: "42px", marginBottom: "20px" }}>Poängtabell</h1>
      
      <h2 style={{ color: "#943030", fontSize: "24px", marginTop: "30px" }}>Ordinarie poäng</h2>
      <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: "600px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}></th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>öppen</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>dold</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style={{ border: "1px solid #ddd", padding: "8px" }}>tretal 2-8</td><td style={{ border: "1px solid #ddd", padding: "8px" }}>2</td><td style={{ border: "1px solid #ddd", padding: "8px" }}>4</td></tr>
          <tr><td style={{ border: "1px solid #ddd", padding: "8px" }}>tretal 1, 9</td><td style={{ border: "1px solid #ddd", padding: "8px" }}>4</td><td style={{ border: "1px solid #ddd", padding: "8px" }}>8</td></tr>
          <tr><td style={{ border: "1px solid #ddd", padding: "8px" }}>tretal vindar</td><td style={{ border: "1px solid #ddd", padding: "8px" }}>4</td><td style={{ border: "1px solid #ddd", padding: "8px" }}>8</td></tr>
          <tr><td style={{ border: "1px solid #ddd", padding: "8px" }}>tretal drakar</td><td style={{ border: "1px solid #ddd", padding: "8px" }}>4</td><td style={{ border: "1px solid #ddd", padding: "8px" }}>8</td></tr>
          <tr><td style={{ border: "1px solid #ddd", padding: "8px" }}>fyrtal 2-8</td><td style={{ border: "1px solid #ddd", padding: "8px" }}>8</td><td style={{ border: "1px solid #ddd", padding: "8px" }}>16</td></tr>
          <tr><td style={{ border: "1px solid #ddd", padding: "8px" }}>fyrtal 1, 9</td><td style={{ border: "1px solid #ddd", padding: "8px" }}>16</td><td style={{ border: "1px solid #ddd", padding: "8px" }}>32</td></tr>
          <tr><td style={{ border: "1px solid #ddd", padding: "8px" }}>fyrtal vindar</td><td style={{ border: "1px solid #ddd", padding: "8px" }}>16</td><td style={{ border: "1px solid #ddd", padding: "8px" }}>32</td></tr>
          <tr><td style={{ border: "1px solid #ddd", padding: "8px" }}>fyrtal drakar</td><td style={{ border: "1px solid #ddd", padding: "8px" }}>16</td><td style={{ border: "1px solid #ddd", padding: "8px" }}>32</td></tr>
          <tr><td style={{ border: "1px solid #ddd", padding: "8px" }}>par drakar</td><td style={{ border: "1px solid #ddd", padding: "8px" }}>2</td><td style={{ border: "1px solid #ddd", padding: "8px" }}>2</td></tr>
          <tr><td style={{ border: "1px solid #ddd", padding: "8px" }}>par egen vind</td><td style={{ border: "1px solid #ddd", padding: "8px" }}>2</td><td style={{ border: "1px solid #ddd", padding: "8px" }}>2</td></tr>
          <tr><td style={{ border: "1px solid #ddd", padding: "8px" }}>blomma/årstid</td><td style={{ border: "1px solid #ddd", padding: "8px" }}>4</td><td style={{ border: "1px solid #ddd", padding: "8px" }}></td></tr>
        </tbody>
      </table>

      <h2 style={{ color: "#943030", fontSize: "24px", marginTop: "30px" }}>Multiplikatorer</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        <li>tretal eller fyrtal egen vind: X2</li>
        <li>tretal eller fyrtal drakar: X2</li>
        <li>tre dolda tre- eller fyrtal: X2</li>
        <li>hel stege 1-9 av en sort: X2</li>
      </ul>

      <h2 style={{ color: "#943030", fontSize: "24px", marginTop: "30px" }}>Vinnaren</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        <li>mahjong: 10</li>
        <li>mahjong på egen dragen bricka: 2</li>
        <li>dold mahjong på slängd bricka: 2</li>
        <li>dold mahjong på egen dragen bricka: X2</li>
        <li>mahjong på sista brickan i spelet: X2</li>
        <li>mahjong på dragen extrabricka efter Kong: X2</li>
        <li>inga poäng: 10</li>
        <li>en sort och vindar eller drakar: X2</li>
        <li>uteslutande en sort: X8</li>
        <li>inga stegar: X2</li>
      </ul>
    </div>
  );
}
