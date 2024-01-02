import React, { useState } from "react";
import axios from "axios";
import { obtenerToken } from "../utils/auth";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";

import { useDispatch } from "react-redux";
import { increment } from "../contexts/features/counter/counterSlice";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function EnviarBanco({ nombrepdf, buttonAEVBUSA, vivienda }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const dispatch = useDispatch();

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
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setErrorRespuestas(`RS: ${data.message}`);
        } else if (status === 500) {
          setErrorRespuestas(`RS: ${data.message}`);
        }
      } else if (error.request) {
        setErrorRespuestas("RF: No se pudo obtener respuesta del servidor");
      } else {
        setErrorRespuestas("RF: Error al enviar la solicitud");
      }
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
            // disabled={buttonAEVBUSA}
            disabled={vivienda ? vivienda : buttonAEVBUSA}
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
        disableEscapeKeyDown
        keepMounted
        open={abrirGuardar}
        TransitionComponent={Transition}
        onClose={cerrarGuardarPdf}
        aria-describedby="alert-dialog-slide-description"
        onClick={(e) => e.stopPropagation()}
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
          <Button
            onClick={() => {
              cerrarGuardarPdf();
              dispatch(increment());
            }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
