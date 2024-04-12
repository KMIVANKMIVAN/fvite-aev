import { useState } from "react";
import { MostrarDerivacion } from "../../components/verificarBuson/MostrarDerivacion";

import Typography from "@mui/material/Typography";

import {
  notifySuccess,
  notifyFirmadoError,
  notifyFirmadoSuccess,
} from "../../notificaciones/notifications";

import { toast } from "react-toastify";
import Button from "@mui/material/Button";
export function BusonDeriv() {
  const [showToast, setShowToast] = useState(false);
  const handleButtonClick = () => {
    // Mostrar la notificación de toast cuando se hace clic en el botón
    // toast.info("¡Has lanzado el toastik!");
    // toast.success('Mensaje de éxito', { position: toast.POSITION.TOP_CENTER });
    notifySuccess(`exito`, "global-container");
    notifyFirmadoSuccess(`exito 2`, "global-container");
  };
  return (
    <>
      <Typography
        className="pt-5 text-center relative bg-gradient-to-r from-c600 to-c400 text-transparent bg-clip-text"
        gutterBottom
        sx={{
          fontSize: { xs: "h5.fontSize", sm: "h3.fontSize" },
          transition: "text-shadow 0.3s ease",
          textShadow: "4px 4px 8px rgba(0, 0, 0, 0.4)",
        }}
        onMouseOver={(e) => {
          e.target.style.textShadow = "8px 8px 16px rgba(0, 0, 0, 0.4)";
        }}
        onMouseOut={(e) => {
          e.target.style.textShadow = "4px 4px 8px rgba(0, 0, 0, 0.4)";
        }}
      >
        BUSON DERIVACION
      </Typography>
      <MostrarDerivacion />
      {/* <Button variant="contained" onClick={handleButtonClick}>
        Lanzar Toastik
      </Button> */}
    </>
  );
}
