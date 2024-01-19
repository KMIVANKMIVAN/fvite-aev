import React from "react";
import Paper from "@mui/material/Paper";
const footerStyle = {
  position: "fixed",
  bottom: 0,
  width: "100%",
};
export function Footer() {
  return (
    <Paper elevation={24} style={footerStyle}>
      <div className="py-2 text-center bg-white font-bold text-blue-900">
        Copyright © 2023 - Agencia Estatal de Vivienda, Actualizado a Octubre
        2023
      </div>
    </Paper>
  );
}
