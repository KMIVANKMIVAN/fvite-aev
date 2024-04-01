import React, { useState } from "react";
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
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function SubirBajarEliminarPdf({
  nombrepdf,
  buttonAEVBUSA,
  vivienda,
  nomCarperta,
}) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

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

  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const urlBase = `${apiKey}/documentpdf`;

  const cargarElPDF = (event) => {
    setSelecionarPDF(event.target.files[0]);
    setErrorRespuestas(null);
    setRespuestas(null);
  };

  const guardarPdf = async () => {
    const formData = new FormData();
    formData.append("file", selecionarPDF);
    try {
      const response = await axios.post(
        `${urlBase}/upload/${nomCarperta}/${nombrepdf}`,
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        const responseData = await response.data.text();
        setRespuestas(`RS: ${responseData}`);
      }
    } catch (error) {
      /* if (error.response && error.response.data instanceof Blob) {
        const blob = await error.response.data;
        const reader = new FileReader();
        reader.onload = () => {
          const errorMessage = reader.result;
          setErrorRespuestas(`RS: ${errorMessage}`);
        };
        reader.readAsText(blob);
      } else {
        setErrorRespuestas(`RS: ${error.message}`);
      } */
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

  const descargarPdf = async () => {
    try {
      const response = await axios.get(
        `${urlBase}/download/${nomCarperta}/${nombrepdf}`,
        {
          headers,
          responseType: "blob",
        }
      );

      const contentDisposition = response.headers["content-disposition"];
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      let serverFilename = `${nombrepdf}.pdf`; // Nombre predeterminado si no se encuentra el nombre en la cabecera de respuesta

      if (contentDisposition) {
        const matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) {
          serverFilename = matches[1].replace(/['"]/g, "");
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", serverFilename); // Descargar con el nombre del servidor
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Eliminar el enlace después de la descarga
    } catch (error) {
      let errorMessage = "RS:"; // Mensaje predeterminado

      if (error.response && error.response.data instanceof Blob) {
        // Si hay una respuesta de error desde el servidor
        const blob = await error.response.data;
        const reader = new FileReader();
        reader.onload = () => {
          errorMessage = reader.result;
          setErrorRespuestasDescargar(`RS: ${errorMessage}`);
        };
        reader.readAsText(blob);
      } else if (error.response && error.response.data) {
        // Si hay un mensaje de error del servidor en formato no-Blob
        errorMessage = error.response.data;
        setErrorRespuestasDescargar(`RS: ${errorMessage}`);
      } else {
        // Otros casos de error
        errorMessage = error.message || "Error desconocido al descargar el PDF";
        setErrorRespuestasDescargar(`RS: ${errorMessage}`);
      }
      setAbrirErrorDescarga(true);
    }
  };

  const eliminarPdf = async () => {
    try {
      const response = await axios.delete(`${urlBase}/delete/${nomCarperta}/${nombrepdf}`, {
        headers,
      });

      if (response.status === 200 || response.status === 204) {
        setRespuestasEliminar(`RS: ${response.data}`);
        setAbrirEliminar(true);
      }
    } catch (error) {
      setErrorRespuestasEliminar(
        `RS: ${error.response?.data}` || `RS: ${error.message}`
      );
      setAbrirErrorEliminar(true);
    }
  };

  const [abrirGuardar, setAbrirGuardar] = useState(false);

  const cerrarGuardarPdf = () => {
    setAbrirGuardar(false);
    setRespuestas(null);
    setErrorRespuestas(null);
  };

  return (
    <>
      {respuestasErrorEliminar !== null && (
        <Dialog
          open={abrirErrorEliminar}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setAbrirErrorEliminar(false)}
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
            <Button onClick={() => setAbrirErrorEliminar(false)}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      )}
      {respuestasEliminar !== null && (
        <Dialog
          open={abrirEliminar}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setAbrirEliminar(false)}
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
            <Button onClick={() => setAbrirEliminar(false)}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      )}

      {respuestasErrorDescargar && (
        <Dialog
          open={abrirErrorDescarga}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setAbrirErrorDescarga(false)}
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
            <Button onClick={() => setAbrirErrorDescarga(false)}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      )}
      <ButtonGroup variant="text" aria-label="text button group">
        <Tooltip title="Descargar PDF" placement="top">
          <Button
            size="small"
            color="error"
            onClick={descargarPdf}
            endIcon={<PictureAsPdfRoundedIcon size="large" />}
          >
          </Button>
        </Tooltip>
        <Tooltip title="Eliminar PDF" placement="right-start">
          <Button
            // disabled={vivienda ? vivienda : buttonAEVBUSA}
            disabled={buttonAEVBUSA}
            size="small"
            color="error"
            onClick={eliminarPdf}
            endIcon={<DeleteRoundedIcon size="large" />}
          >
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
        <DialogTitle className="text-center">
          {"Subir Instructivo PDF"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <div className="flex justify-center items-center flex-col">
              <input
                className="block w-full text-sm bold text-mi-color-primario
      file:mr-4 file:py-2 file:px-4
      file:rounded-md file:border-0
      file:text-sm file:font-semibold
      file:bg-mi-color-primario file:text-white
      hover:file:bg-mi-color-terceario"
                type="file"
                accept=".pdf"
                onChange={cargarElPDF}
              />
            </div>
          </DialogContentText>
        </DialogContent>
        {respuestasError && (
          <p className="text-center m-2 text-red-500">{respuestasError}</p>
        )}
        {respuestas && (
          <p className="text-center m-2 text-green-500">{respuestas}</p>
        )}
        <DialogActions>
          <Button disabled={!selecionarPDF} onClick={guardarPdf}>
            Subir PDF
          </Button>
          <Button onClick={cerrarGuardarPdf}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
