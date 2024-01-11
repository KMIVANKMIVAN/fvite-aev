import React from "react";
import Paper from "@mui/material/Paper";
import navbar from "../assets/navbar.png";

export function Navbar() {
  return (
    <Paper elevation={24} style={{ marginBottom: "50px" }}>
      <div className="bg-contain bg-center" style={{ textAlign: "center" }}>
        <img
          src={navbar}
          style={{ height: "80px", display: "inline-block" }}
          alt="Navbar"
        />
      </div>
    </Paper>
  );
}
