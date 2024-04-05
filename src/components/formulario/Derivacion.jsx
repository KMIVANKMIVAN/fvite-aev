import React, {  useState, useEffect } from "react";

import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";

import axios from "axios";
import { obtenerToken } from "../../utils/auth";
import { obtenerUserId } from "../../utils/userdata";

import { SelecUsuario } from "./SelecUsuario";

export function Derivacion({
  idDesembolso,
  documento,
  codigoProyecto,
  rederizarInstructivo,
  esVivienda,
  esPemar,
  selectVContCodPCodid,
}) {
  // const { selectedId } = useContext(FormularioContext);

  console.log("-->", selectVContCodPCodid);
  console.log("-->", esVivienda);
  console.log("-->", esPemar);

  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const [errorEstado, setErrorEstado] = useState(null);
  const [estadoOptions, setEstadoOptions] = useState("");

  const [errorFirmador, setErrorFirmador] = useState(null);
  const [firmadorOptions, setFirmadorOptions] = useState([]);

  const [formValues, setFormValues] = useState({
    id_desembolso: idDesembolso,

    estado: "",
    id_enviador: obtenerUserId(),
    // id_destinatario: "",
    codigo_proyecto: codigoProyecto,
    documento: documento,
    selectVContCodPCodid: selectVContCodPCodid,
    esVivienda: esVivienda,
    esPemar: esPemar,
  });

  const [derivacion, setDerivacion] = useState(null);
  const [errorderivacion, setErrorDerivacion] = useState(null);
  const [messagederivacion, setMessageDerivacion] = useState(null);

  const [selectedId, setSelectedId] = useState("");

  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${apiKey}/firmador/findAllDepartamento`;
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${apiKey}/estado/1`;
        const response = await axios.get(url, { headers });

        if (response.status === 200) {
          setErrorEstado(null);
          setEstadoOptions(response.data);
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 400 || status === 500) {
            setErrorEstado(`RS: ${data.error}`);
          }
        } else if (error.request) {
          setErrorEstado("RF: No se pudo obtener respuesta del servidor");
        } else {
          setErrorEstado("RF: Error al enviar la solicitud");
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
        id_destinatario: selectedId,
      };

      const response = await axios.post(
        `${apiKey}/derivacion/automatico`,
        payload,
        {
          headers,
        }
      );

      if (response.status === 200 || response.status === 201) {
        setErrorDerivacion(null);
        setMessageDerivacion(null);
        setDerivacion(response.data);
        console.log("Derivación creada con éxito", response.data);
        // Aquí puedes hacer algo después de la creación exitosa, como redireccionar o mostrar un mensaje de éxito
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        setMessageDerivacion(`RS: ${data.error}`);
        setErrorDerivacion(`Error : ${data.message}`);
      } else {
        setErrorDerivacion(
          "Error al enviar la solicitud de creación de derivación"
        );
      }
    }
  };

  const todosLosCamposEstanLlenos = () => {
    const formValuesCompletos = Object.values(formValues).every(
      (value) => value !== "" && value !== null
    );
    const selectedIdCompleto = selectedId !== null && selectedId !== "";
    return formValuesCompletos && selectedIdCompleto;
  };

  return (
    <div style={{ padding: "10px" }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* <Grid item xs={12} md={5}>
            <FormControl fullWidth>
              <Select
                label="Firmador"
                name="firmador"
                value={formValues.firmador}
                onChange={handleChange}
                displayEmpty
                fullWidth
                required
              >
                <MenuItem value="" disabled>
                  Seleccione el Firmante Actual
                </MenuItem>
                {firmadorOptions.map((firmadorItem) => (
                  <MenuItem key={firmadorItem.id} value={firmadorItem.id}>
                    {firmadorItem.cargo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}
          <Grid item xs={12} textAlign="center">
            <Typography variant="h6" gutterBottom className="text-c400">
              PRIMER PASO CREE LA DERIVACION
            </Typography>
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <TextField
              label="Observación"
              name="observacion"
              value={formValues.observacion}
              onChange={handleChange}
              fullWidth
              // required
            />
          </Grid> */}
          <Grid item xs={12} md={3}>
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
                <MenuItem value={estadoOptions.id}>
                  {estadoOptions.estado}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Documento"
              value={documento}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <SelecUsuario pasar={setSelectedId} nombresPasar={selectedId} />
          </Grid>
          {/* <input type="hidden" /> */}
          <Grid item xs={6}>
            <input
              label="ID Desembolso"
              value={idDesembolso}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              type="hidden"
            />
          </Grid>
          <Grid item xs={6}>
            <input
              label="ID Enviador"
              value={obtenerUserId()}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              type="hidden"
            />
          </Grid>
          {/* <Grid item xs={6}>
            <input
              label="ID Enviador"
              value={codigoProyecto}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              type="hidden"
            />
          </Grid> */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Enviar
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="primary"
              endIcon={<DoubleArrowIcon />}
              onClick={() => rederizarInstructivo(true)}
              disabled={!todosLosCamposEstanLlenos()}
            >
              Continuar
            </Button>
          </Grid>
        </Grid>
      </form>
      {errorderivacion && (
        <p className="text-red-700 text-center">{errorderivacion}</p>
      )}
      {messagederivacion && (
        <p className="text-red-700 text-center ">{messagederivacion}</p>
      )}
    </div>
  );
}
