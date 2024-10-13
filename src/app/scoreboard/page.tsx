import React from "react";

const tableStyle = {
  borderCollapse: "collapse",
  width: "100%",
  maxWidth: "600px",
  margin: "20px 0",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const thStyle = {
  backgroundColor: "#943030",
  color: "white",
  padding: "12px",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "12px",
};

const listStyle = {
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
};

export default function ScoreboardPage() {
  return (
    <div style={{ padding: "40px", fontFamily: "HelveticaNeueLight, Helvetica, Arial, sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "#943030", fontSize: "42px", marginBottom: "30px", textAlign: "center" }}>Poängtabell</h1>
      
      <h2 style={{ color: "#943030", fontSize: "28px", marginTop: "40px", borderBottom: "2px solid #943030", paddingBottom: "10px" }}>Ordinarie poäng</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}></th>
            <th style={thStyle}>Öppen</th>
            <th style={thStyle}>Dold</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style={tdStyle}>Tretal 2-8</td><td style={tdStyle}>2</td><td style={tdStyle}>4</td></tr>
          <tr><td style={tdStyle}>Tretal 1, 9</td><td style={tdStyle}>4</td><td style={tdStyle}>8</td></tr>
          <tr><td style={tdStyle}>Tretal vindar</td><td style={tdStyle}>4</td><td style={tdStyle}>8</td></tr>
          <tr><td style={tdStyle}>Tretal drakar</td><td style={tdStyle}>4</td><td style={tdStyle}>8</td></tr>
          <tr><td style={tdStyle}>Fyrtal 2-8</td><td style={tdStyle}>8</td><td style={tdStyle}>16</td></tr>
          <tr><td style={tdStyle}>Fyrtal 1, 9</td><td style={tdStyle}>16</td><td style={tdStyle}>32</td></tr>
          <tr><td style={tdStyle}>Fyrtal vindar</td><td style={tdStyle}>16</td><td style={tdStyle}>32</td></tr>
          <tr><td style={tdStyle}>Fyrtal drakar</td><td style={tdStyle}>16</td><td style={tdStyle}>32</td></tr>
          <tr><td style={tdStyle}>Par drakar</td><td style={tdStyle}>2</td><td style={tdStyle}>2</td></tr>
          <tr><td style={tdStyle}>Par egen vind</td><td style={tdStyle}>2</td><td style={tdStyle}>2</td></tr>
          <tr><td style={tdStyle}>Blomma/årstid</td><td style={tdStyle}>4</td><td style={tdStyle}>-</td></tr>
        </tbody>
      </table>

      <h2 style={{ color: "#943030", fontSize: "28px", marginTop: "40px", borderBottom: "2px solid #943030", paddingBottom: "10px" }}>Multiplikatorer</h2>
      <ul style={listStyle}>
        <li>Tretal eller fyrtal egen vind: X2</li>
        <li>Tretal eller fyrtal drakar: X2</li>
        <li>Tre dolda tre- eller fyrtal: X2</li>
        <li>Hel stege 1-9 av en sort: X2</li>
      </ul>

      <h2 style={{ color: "#943030", fontSize: "28px", marginTop: "40px", borderBottom: "2px solid #943030", paddingBottom: "10px" }}>Vinnaren</h2>
      <ul style={listStyle}>
        <li>Mahjong: 10</li>
        <li>Mahjong på egen dragen bricka: 2</li>
        <li>Dold mahjong på slängd bricka: 2</li>
        <li>Dold mahjong på egen dragen bricka: X2</li>
        <li>Mahjong på sista brickan i spelet: X2</li>
        <li>Mahjong på dragen extrabricka efter Kong: X2</li>
        <li>Inga poäng: 10</li>
        <li>En sort och vindar eller drakar: X2</li>
        <li>Uteslutande en sort: X8</li>
        <li>Inga stegar: X2</li>
      </ul>
    </div>
  );
}
