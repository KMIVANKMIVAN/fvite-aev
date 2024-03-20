import { useContext, useState, useEffect } from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import axios from "axios";
import { obtenerToken } from "../../utils/auth";

import { MostrarDerivacionPorEstados } from "./MostrarDerivacionPorEstados";

export function MostrarDerivacion() {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const [busonDerivacion, setBusonDerivacion] = useState([]);
  const [errorBusonDerivacion, setErrorBusonDerivacion] = useState(null);

  const [errorEstado, setErrorEstado] = useState(null);
  const [estadoOptions, setEstadoOptions] = useState([]);

  // Actualiza el valor inicial de `value` para que coincida con el valor del primer Tab si es necesario
  const [value, setValue] = useState(0); // Modificado el valor inicial para que coincida con el primer tab

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-1 py-1 lg:px-4">
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Mostrar Enviados" />
          <Tab label="Mostrar Rechazados" />
          <Tab label="Mostrar Aceptados" />
        </Tabs>
        <Box sx={{ paddingTop: 2 }}>
          {value === 0 && <MostrarDerivacionPorEstados estado="1" />}
          {value === 1 && <MostrarDerivacionPorEstados estado="2" />}
          {value === 2 && <MostrarDerivacionPorEstados estado="3" />}
        </Box>
      </Box>
    </div>
  );
}
