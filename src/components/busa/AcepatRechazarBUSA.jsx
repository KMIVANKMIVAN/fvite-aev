import React, { useState, useEffect } from "react";
import axios from "axios";
import { obtenerToken } from "../../utils/auth";
import { obtenerUserId } from "../../utils/userdata";

import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";

export function AcepatRechazarBUSA({ nombrepdf, cite }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const [crearRAB, setCrearRAB] = useState(null);
  const [errorCrearRAB, setErrorCrearRAB] = useState(null);

  const [reloadEliminar, setReloadEliminar] = useState(false); // Estado para controlar la recarga

  const [formValues, setFormValues] = useState({
    observacion: "",
    id_usuario: obtenerUserId(),
    estado: false,
    instructivo: nombrepdf,
    sereenvio: "",
    cite: cite,
    tiporechazo: "",
  });

  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const hoy = new Date();
  const diaActual = hoy.toISOString().slice(0, 10);

  const [fechaInicio, setFechaInicio] = useState(diaActual);

  /* useEffect(() => {
    const obtenerDatosFindAllOne = async () => {
      try {
        const url = `${apiKey}/respaldodesembolsos/findallone/${nombrepdf}`;

        const response = await axios.get(url, { headers });

        if (response.status === 200) {
          setErrorRespuestaFindallone(null);
          setRespuestaFindallone(response.data);
        }
      } catch (error) {
        setRespuestaFindallone([]);

        if (error.response) {
          const { status, data } = error.response;
          if (status === 400) {
            setErrorRespuestaFindallone(`RS: ${data.error}`);
          } else if (status === 500) {
            setErrorRespuestaFindallone(`RS: ${data.message}`);
          }
        } else if (error.request) {
          setErrorRespuestaFindallone(
            "RF: No se pudo obtener respuesta del servidor"
          );
        } else {
          setErrorRespuestaFindallone("RF: Error al enviar la solicitud");
        }
      }
    };
    obtenerDatosFindAllOne();
  }, [nombrepdf, reloadEliminar]); */

  const crearRechazarAceptarBusa = async () => {
    try {
      const url = `${apiKey}/respaldodesembolsos`;

      const response = await axios.get(url, { headers });

      if (response.status === 200) {
        setErrorCrearRAB(null);
        setCrearRAB(response.data);
      }
    } catch (error) {
      setCrearRAB(null);

      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setErrorCrearRAB(`RS: ${data.error}`);
        } else if (status === 500) {
          setErrorCrearRAB(`RS: ${data.message}`);
        }
      } else if (error.request) {
        setErrorCrearRAB("RF: No se pudo obtener respuesta del servidor");
      } else {
        setErrorCrearRAB("RF: Error al enviar la solicitud");
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <>
      <div
        className="ml-1 rounded-tl-lg rounded-br-lg mt-5"
        style={{ borderLeft: "10px solid #184E77" }}
      >
        <form onSubmit={crearRechazarAceptarBusa} className="ml-3">
          <Grid container spacing={2}>
            <Grid item xs={12} textAlign="center">
              <Typography variant="h4" gutterBottom className="text-c500 pt-5">
                RESPONDER
              </Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <Select
                  label="Estado"
                  name="estado"
                  value={formValues.estado}
                  onChange={handleChange}
                  displayEmpty
                  fullWidth
                  required
                >
                  <MenuItem value="" disabled>
                    Seleccione el Estado
                  </MenuItem>
                  <MenuItem value={true}>ACEPTAR</MenuItem>
                  <MenuItem value={false}>RECHAZAR</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={10}>
              <TextField
                label="Observacion"
                value={nombrepdf}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} md={10}>
              <TextField
                label="Documento"
                value={nombrepdf}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12}></Grid>
          </Grid>
          <Grid container className="pb-5">
            <Grid
              xs={12}
              md={6}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button variant="outlined" type="submit">
                Enviar
              </Button>
            </Grid>
            <Grid
              xs={12}
              md={6}
              style={{ display: "flex", justifyContent: "center" }}
            ></Grid>
          </Grid>
        </form>
        <div className="ml-3">
          <Grid item xs={12} md={10}>
            <InputLabel>Fecha del Desembolso:</InputLabel>
            <Input
              variant="filled"
              type="date"
              id="fechaInicio"
              value={fechaInicio}
              // onChange={handleFechaInicioChange}
            />
          </Grid>
        </div>
      </div>
    </>
  );
}
