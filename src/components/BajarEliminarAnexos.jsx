import React, { useState, useEffect } from "react";
import axios from "axios";
import { obtenerToken } from "../utils/auth";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";

import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

import { obtenerDatosFindAllOne } from "./api";

export function BajarEliminarAnexos({ nombrepdf }) {
  const [respuestas, setRespuestas] = useState(null);
  const [respuestasError, setErrorRespuestas] = useState(null);
  const [respuestasErrorDescargar, setErrorRespuestasDescargar] =
    useState(null);
  const [respuestasEliminar, setRespuestasEliminar] = useState(null);
  const [respuestasErrorEliminar, setErrorRespuestasEliminar] = useState(null);
  const [selecionarPDF, setSelecionarPDF] = useState(null);
  const [abrirErrorDescarga, setAbrirErrorDescarga] = useState(false);
  const [abrirErrorEliminar, setAbrirErrorEliminar] = useState(false);
  const [abrirEliminar, setAbrirEliminar] = useState(false);

  const [respuestaFindallone, setRespuestaFindallone] = useState(null);
  const [errorRespuestaFindallone, setErrorRespuestaFindallone] =
    useState(null);

  console.log("esto llega nombrepdf", nombrepdf);

  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const urlBase = `${process.env.NEXT_PUBLIC_BASE_URL_BACKEND}`;

  useEffect(() => {
    const obtenerDatosFindAllOne = async () => {
      try {
        const token = obtenerToken();
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const url = `${process.env.NEXT_PUBLIC_BASE_URL_BACKEND}/respaldodesembolsos/findallone/${nombrepdf}`;

        const response = await axios.get(url, { headers });

        if (response.status === 200) {
          console.log("Datos recibidos:", response.data);
          setRespuestaFindallone(response.data);
          setErrorRespuestaFindallone(null);
        } else {
          console.error("Error al obtener los datos:", response.statusText);
          setErrorRespuestaFindallone(
            `Error en el estado de respuesta, estado: ${response.statusText}`
          );
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setErrorRespuestaFindallone(`Error del servidor: ${error}`);
      }
    };

    if (nombrepdf) {
      obtenerDatosFindAllOne();
    }
  }, [nombrepdf]);

  const cargarElPDF = (event) => {
    setSelecionarPDF(event.target.files[0]);
    setErrorRespuestas(null); // Reiniciar el estado de respuestasError
    setRespuestas(null); // Reiniciar el estado de respuestasError
  };

  const descargarPdf = async (desembolsosId, archivo) => {
    try {
      const response = await axios.get(
        `${urlBase}/respaldodesembolsos/descargardesembidarchiv/${desembolsosId}/${archivo}`,
        {
          headers,
          responseType: "blob",
        }
      );

      const contentDisposition = response.headers["content-disposition"];
      let serverFilename = `${archivo} ${desembolsosId}.pdf`; // Nombre predeterminado

      if (contentDisposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);

        if (matches && matches[1]) {
          serverFilename = matches[1].replace(/['"]/g, "");
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", serverFilename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      // Manejo de errores
    }
  };

  const eliminarPdf = async (desembolsosId, archivo) => {
    try {
      const response = await axios.get(
        `${urlBase}/respaldodesembolsos/eliminardesembidarchiv/${desembolsosId}/${archivo}`,
        {
          headers,
        }
      );

      if (response.status === 200 || response.status === 204) {
        setRespuestasEliminar(`RS: ${response.data}`);
        setAbrirEliminar(true);
      }
    } catch (error) {
      let errorMessage = "Error desconocido al descargar el PDF";

      if (error.response && error.response.data instanceof Blob) {
        // Si hay una respuesta de error desde el servidor
        const blob = await error.response.data;
        const reader = new FileReader();
        reader.onload = () => {
          errorMessage = reader.result;
          setErrorRespuestasDescargar(`RS: ${errorMessage}`);
          // Opcionalmente, puedes setear abrirErrorDescarga a true si deseas abrir el diálogo de error automáticamente
          // setAbrirErrorDescarga(true);
        };
        reader.readAsText(blob);
      } else if (error.response && error.response.data) {
        // Si hay un mensaje de error del servidor en formato no-Blob
        errorMessage = error.response.data;
        setErrorRespuestasDescargar(`RS: ${errorMessage}`);
        // Opcionalmente, puedes setear abrirErrorDescarga a true si deseas abrir el diálogo de error automáticamente
        // setAbrirErrorDescarga(true);
      } else {
        // Otros casos de error
        errorMessage = error.message || "Error desconocido al descargar el PDF";
        setErrorRespuestasDescargar(`RS: ${errorMessage}`);
        // Opcionalmente, puedes setear abrirErrorDescarga a true si deseas abrir el diálogo de error automáticamente
        // setAbrirErrorDescarga(true);
      }
      // Si prefieres abrir el diálogo de error manualmente, puedes hacerlo con:
      setAbrirErrorDescarga(true);
    }
  };

  console.log("respuestasErrorEliminar", respuestasErrorEliminar);
  console.log("respuestasEliminar", respuestasEliminar);

  const [abrirGuardar, setAbrirGuardar] = useState(false);

  const abrirGuardarPdf = () => {
    setAbrirGuardar(true); // Cambiar a true para abrir el diálogo
  };

  const cerrarGuardarPdf = () => {
    setAbrirGuardar(false);
    setRespuestas(null);
    setErrorRespuestas(null);
  };

  console.log("111");
  console.log("respuestaFindallone:", respuestaFindallone);

  const handleClick = () => {
    obtenerDatosFindAllOne(
      selectedContCod,
      setContcodComplejaData,
      setErrorContcodComplejaData
    );
    // Aquí puedes realizar otras acciones si es necesario al hacer clic en este botón
  };

  return (
    <>
      {respuestasErrorEliminar !== null && (
        <Dialog
          open={abrirErrorEliminar}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setAbrirErrorEliminar(false)} // Cierra el diálogo al hacer clic en "Cerrar"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {respuestasErrorEliminar && (
                <p className="text-center m-2 text-red-500">
                  {respuestasErrorEliminar}
                </p>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setAbrirErrorEliminar(false);
              }}
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {respuestasEliminar !== null && (
        <Dialog
          open={abrirEliminar}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setAbrirEliminar(false)} // Cierra el diálogo al hacer clic en "Cerrar"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {respuestasEliminar && (
                <p className="text-center m-2 text-green-500">
                  {respuestasEliminar}
                </p>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setAbrirEliminar(false);
              }}
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {respuestasErrorDescargar && (
        <Dialog
          open={abrirErrorDescarga} // Controla la apertura automática del diálogo
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setAbrirErrorDescarga(false)} // Cierra el diálogo al hacer clic en "Cerrar"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <p className="text-center m-2 text-red-500">
                {respuestasErrorDescargar}
              </p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <DialogActions>
              <Button
                onClick={() => {
                  setAbrirErrorDescarga(false);
                }}
              >
                Cerrar
              </Button>
            </DialogActions>
          </DialogActions>
        </Dialog>
      )}

      {respuestaFindallone &&
        respuestaFindallone.map((item) => (
          <div key={item.id} className="grid grid-cols-1 ">
            <div>
              <p className="">{item.detalle}</p>
            </div>
            <div>
              <ButtonGroup variant="text" aria-label="text button group">
                <Tooltip title="Descargar PDF" placement="top">
                  <Button
                    size="small"
                    color="error"
                    onClick={() =>
                      descargarPdf(item.desembolsos_id, item.archivo)
                    }
                    endIcon={<PictureAsPdfRoundedIcon size="large" />}
                  ></Button>
                </Tooltip>
                <Tooltip title="Eliminar PDF" placement="right-start">
                  <Button
                    size="small"
                    color="error"
                    onClick={() =>
                      eliminarPdf(item.desembolsos_id, item.archivo)
                    }
                    endIcon={<DeleteRoundedIcon size="large" />}
                  ></Button>
                </Tooltip>
              </ButtonGroup>
            </div>
          </div>
        ))}
    </>
  );
}
