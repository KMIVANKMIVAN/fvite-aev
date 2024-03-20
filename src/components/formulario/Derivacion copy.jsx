import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import ZoomInIcon from "@mui/icons-material/ZoomIn";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import axios from "axios";
import { obtenerToken } from "../../utils/auth";

export function Derivacion({
  codigoProyecto,
  id_desembolso,
  firmador,
  id_enviador,
  id_destinatario,
  documento,
  fecha_envio,
}) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const [errorFirmador, setErrorFirmador] = useState(null);
  const [firmadorOptions, setFirmadorOptions] = useState([]);
  const [formValues, setFormValues] = useState({
    firmador: "",
    limite: "",
    observacion: "",
    recibido: "",
    estado: "",
  });

  const [derivacion, setDerivacion] = useState(null);
  const [errorderivacion, setErrorDerivacion] = useState(null);
  /////
  const [reloadComponents, setReloadComponents] = useState(false);
  const [datoscontratoData, setDatoscontratoData] = useState([]);
  const [errorDatoscontratoData, setErrorDatoscontratoData] = useState([]);
  //
  const [buscar, setBuscar] = useState("");
  const [idUserEncontrado, setIdUserEncontrado] = useState("");


  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${apiKey}/firmador`;
        const response = await axios.get(url, { headers });

        if (response.status === 200) {
          setErrorFirmador(null);
          setFirmadorOptions(response.data);
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 400 || status === 500) {
            setErrorFirmador(`RS: ${data.message}`);
          }
        } else if (error.request) {
          setErrorFirmador("RF: No se pudo obtener respuesta del servidor");
        } else {
          setErrorFirmador("RF: Error al enviar la solicitud");
        }
      }
    };

    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    crearDerivacion();
  };

  const crearDerivacion = async () => {
    try {
      // Asegúrate de incluir los datos correctos aquí
      const payload = {
        ...formValues,
        codigoProyecto,
        id_desembolso,
        firmador: formValues.firmador || firmador, // Asumiendo que quieras enviar el firmador seleccionado o el firmador por defecto
        id_enviador,
        id_destinatario,
        documento,
        fecha_envio,
      };

      const response = await axios.post(`${apiKey}/derivacion`, payload, {
        headers,
      });

      if (response.status === 200 || response.status === 201) {
        setErrorDerivacion(null);
        setDerivacion(response.data);
        console.log("Derivación creada con éxito", response.data);
        // Aquí puedes hacer algo después de la creación exitosa, como redireccionar o mostrar un mensaje de éxito
      }
    } catch (error) {
      console.error("Error al crear la derivación:", error);
      if (error.response) {
        const { status, data } = error.response;
        setErrorDerivacion(`Error ${status}: ${data.message}`);
      } else {
        setErrorDerivacion(
          "Error al enviar la solicitud de creación de derivación"
        );
      }
    }
  };

  const columns = [
    { id: "id", label: "ID", minWidth: 50, align: "center" },
    { id: "seleccionar", label: "SELECCIONAR", minWidth: 50, align: "center" },
    { id: "username", label: "USUARIO", minWidth: 150, align: "center" },
    { id: "nombre", label: "NOMBRES", minWidth: 150, align: "center" },
    { id: "cargo", label: "CARGO", minWidth: 150, align: "center" },
    {
      id: "departamento",
      label: "DEPARTAMENTO",
      minWidth: 150,
      align: "center",
    },
  ];

  const handleSearch = async () => {
    try {
      const url = `${apiKey}/users/buscar/${buscar}`;
      const token = obtenerToken();
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });

      if (response.status === 200) {
        setReloadComponents(!reloadComponents);
        setErrorDatoscontratoData(null);
        setDatoscontratoData(response.data);
        setIsDataLoaded(true);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setErrorDatoscontratoData(`RS: ${data.message}`);
        } else if (status === 500) {
          setErrorDatoscontratoData(`RS: ${data.message}`);
        }
      } else if (error.request) {
        setErrorDatoscontratoData(
          "RF: No se pudo obtener respuesta del servidor"
        );
      } else {
        setErrorDatoscontratoData("RF: Error al enviar la solicitud");
      }
    }
  };

  const rows = datoscontratoData;

  const handleInputChange = (event) => {
    const { value } = event.target;
    setBuscar(value);
  };

  return (
    <div style={{ padding: "10px" }}>
      <Typography className="p-3 text-c600 text-2xl" variant="h4" gutterBottom>
        Buscar
      </Typography>
      <Grid container spacing={2}>
        <Grid xs={1}></Grid>
        <Grid xs={10}>
          <TextField
            name="codigo"
            // helperText="Ejemplo: nombre.apellido o 123456789"
            id="standard-basic"
            label="Nombre Completo"
            variant="standard"
            className="w-full "
            value={buscar}
            onChange={handleInputChange}
          />
          <br />{" "}
          <Button
            onClick={handleSearch}
            variant="outlined"
            endIcon={<ZoomInIcon />}
          >
            Buscar
          </Button>
        </Grid>
        <Grid xs={1}></Grid>
      </Grid>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        key={column.id}
                        align="center"
                        style={{ textAlign: "center" }}
                      >
                        {column.id === "seleccionar" ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <FormControlLabel
                              required
                              control={<Checkbox />}
                              // label="Seleccionar"
                            />
                          </div>
                        ) : (
                          value
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Select
                label="Firmador"
                name="firmador"
                value={formValues.firmador}
                onChange={handleChange}
                displayEmpty
                fullWidth
              >
                <MenuItem value="" disabled>
                  Seleccione un firmador
                </MenuItem>
                {firmadorOptions.map((firmadorItem) => (
                  <MenuItem key={firmadorItem.id} value={firmadorItem.id}>
                    {firmadorItem.cargo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Límite"
              name="limite"
              value={formValues.limite}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Observación"
              name="observacion"
              value={formValues.observacion}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Recibido"
              name="recibido"
              value={formValues.recibido}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Estado"
              name="estado"
              value={formValues.estado}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* Se muestran los datos que llegan como propiedades */}
          <Grid item xs={6}>
            <TextField
              label="ID Desembolso"
              value={id_desembolso}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="ID Enviador"
              value={id_enviador}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="ID Destinatario"
              value={id_destinatario}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Documento"
              value={documento}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Fecha de Envío"
              value={fecha_envio}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Enviar
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
