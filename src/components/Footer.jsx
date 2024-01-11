import React from "react";
import Paper from "@mui/material/Paper";
export function Footer() {
  return (
    <Paper elevation={24} style={{ padding: "20px", marginTop: "50px" }}>
      <div className=" text-center bg-white font-bold text-blue-900">
        Copyright © 2023 - Agencia Estatal de Vivienda, Actualizado a Octubre
        2023
      </div>
    </Paper>
  );
}
