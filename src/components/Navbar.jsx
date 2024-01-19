import React from "react";
import Paper from "@mui/material/Paper";
import navbar from "../assets/LogotipoAEV.png";

export function Navbar() {
  return (
    <Paper elevation={24} >
      <div className="bg-contain bg-center" style={{ textAlign: "center" }}>
        <img
          src={navbar}
          style={{ height: "110px", display: "inline-block" }}
          alt="Navbar"
        />
      </div>
    </Paper>
  );
}
