import React, { useContext, useState, useEffect } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";

import axios from "axios";
import { obtenerToken } from "../../utils/auth";
import { obtenerUserId } from "../../utils/userdata";

export function CambiarEstado({
  idDerivacion,
  idEstado,
  nombreEstado,
  recargar,
}) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const [actulizarEstado, setActulizarEstado] = useState([]);
  const [errorActulizarEstado, setErrorActulizarEstado] = useState(null);

  const [open, setOpen] = useState(false);

  // const [recargarTabla, setRecargarTabla] = useState(false);

  const [formValues, setFormValues] = useState({
    observacion: null,
    estado: idEstado,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const actualizarEstado = async () => {
    try {
      const url = `${apiKey}/derivacion/${idDerivacion}`;
      // Asegurándonos de incluir el cuerpo de la solicitud con los datos actualizados
      const body = {
        estado: formValues.estado,
        observacion: formValues.observacion,
      };
      const response = await axios.patch(url, body, { headers });

      if (response.status === 200) {
        setErrorActulizarEstado(null);
        setActulizarEstado(response.data);
        handleClose(); // Cerrar el diálogo si la actualización es exitosa
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 || status === 500) {
          setErrorActulizarEstado(`Error: ${data.message}`);
        }
      } else if (error.request) {
        setErrorActulizarEstado("No se pudo obtener respuesta del servidor");
      } else {
        setErrorActulizarEstado("Error al enviar la solicitud");
      }
    }
  };

  const textRechazar =
    "Estado Rechazar: Todas las firmas anteriores con el instructivo pasaran a iniciarse de Nuevo (Se iniciara un nuevo Proceso)";
  const textAceptar =
    "Estado Aceptar: El instructivo ha sido aceptado y se procederá con su respectiva firma";

  const textofinal = nombreEstado === "Rechazar" ? textRechazar : textAceptar;

  return (
    <>
      {/* <Button>{nombreEstado}</Button> */}
      <Button
        style={{ textTransform: "none", fontSize: "0.7rem" }}
        size="small"
        variant="outlined"
        onClick={handleClickOpen}
      >
        {nombreEstado}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Se cambiara el estado a: {nombreEstado}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {textofinal}
          </DialogContentText>
          <br />
          {nombreEstado === "Rechazar" && (
            <TextField
              label="Observación"
              fullWidth
              required
              value={formValues.observacion || ""} // Asegurándonos de que siempre haya un valor definido
              onChange={(e) =>
                setFormValues({ ...formValues, observacion: e.target.value })
              }
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            // onClick={actualizarEstado}
            onClick={() => {
              actualizarEstado();
              recargar(true);
            }}
            autoFocus
            color="error"
            disabled={nombreEstado === "Rechazar" && !formValues.observacion}
          >
            Actualizar Estado
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
