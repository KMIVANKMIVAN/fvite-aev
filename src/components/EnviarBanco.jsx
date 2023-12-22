import React, { useState } from "react";
import axios from "axios";
import { obtenerToken } from "../utils/auth";
import { obtenerUserId } from "../utils/userdata";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

import UploadRoundedIcon from "@mui/icons-material/UploadRounded";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function EnviarBanco({ nombrepdf }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const [abrirGuardar, setAbrirGuardar] = useState(false);
  const [respuestaMessage, setRespuestaMessage] = useState(null);
  const [respuestasError, setErrorRespuestas] = useState(null);

  const abrirGuardarPdf = () => {
    setAbrirGuardar(true);
  };

  const cerrarGuardarPdf = () => {
    setErrorRespuestas(null);
    setRespuestaMessage(null);
    setAbrirGuardar(false);
  };

  const enviarBanco = async () => {
    try {
      const token = obtenerToken();
      const response = await axios.get(
        `${apiKey}/documentpdf/enviarbanco/${nombrepdf}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setErrorRespuestas(null);
        setRespuestaMessage(`RS: ${response.data}`);
      }
    } catch (error) {
      setRespuestaMessage(null);
      setErrorRespuestas(`RS: ${error}`);
    }
  };

  const styles = {
    "@keyframes pulse": {
      "0%": {
        transform: "scale(1)",
      },
      "50%": {
        transform: "scale(1.1)",
      },
      "100%": {
        transform: "scale(1)",
      },
    },
    pulseAnimation: {
      transition: "text-shadow 0.3s ease",
      textShadow: "4px 4px 8px rgba(0, 0, 0, 0.4)",
      animation: "pulse 2s infinite",
    },
  };
  return (
    <>
      <ButtonGroup variant="text" aria-label="text button group">
        <Tooltip title="ENVIAR" placement="top">
          <Button
            color="error"
            size="small"
            component="span"
            variant="contained"
            onClick={abrirGuardarPdf}
          >
            Enviar PDF
            <br />
            {nombrepdf}
          </Button>
        </Tooltip>
      </ButtonGroup>
      <Dialog
        open={abrirGuardar}
        TransitionComponent={Transition}
        keepMounted
        onClose={cerrarGuardarPdf}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <div className="flex justify-center items-center flex-col px-5">
              <h1
                className="py-5 text-2xl font-bold text-center relative bg-gradient-to-r from-rojo1 to-rojo2 text-transparent bg-clip-text"
                style={styles.pulseAnimation} // Aplicar los estilos de animación al h1
              >
                ¡IMPORTANTE! <br /> Si usted envía el PDF firmado <br /> (
                {nombrepdf})
                <br />
                NO podrá volver a subir el <br /> Instructivo y/o Anexos.
              </h1>
              <style>
                {`
                @keyframes pulse {
                  0% {
                    transform: scale(1);
                  }
                  50% {
                    transform: scale(1.1);
                  }
                  100% {
                    transform: scale(1);
                  }
                }
              `}
              </style>
            </div>
          </DialogContentText>
        </DialogContent>
        {respuestasError && (
          <p className="text-center m-2 text-red-500">{respuestasError}</p>
        )}
        {respuestaMessage && (
          <p className="text-center m-2 text-green-500">{respuestaMessage}</p>
        )}
        <DialogActions>
          <Button onClick={enviarBanco} variant="contained" color="error">
            Enviar {nombrepdf}
          </Button>
          <Button onClick={cerrarGuardarPdf}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}