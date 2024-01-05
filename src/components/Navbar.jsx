/* import LogotipoAEV from "../assets/LogotipoAEV.png";
export function Navbar() {
  return (
    <div className="bg-contain bg-center  ">
      <img src={LogotipoAEV} alt="icon" className="w-100 mx-auto" />
    </div>
  );
}
 */
import React from "react";
import Paper from "@mui/material/Paper";
import LogotipoAEV from "../assets/LogotipoAEV.png";

export function Navbar() {
  return (
    <Paper elevation={24} style={{ padding: "20px", marginBottom: "50px" }}>
      <div className="bg-contain bg-center">
        <img src={LogotipoAEV} alt="icon" className="w-100 mx-auto" />
      </div>
    </Paper>
  );
}
