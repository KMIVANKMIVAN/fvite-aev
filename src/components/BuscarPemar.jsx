import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import axios from "axios";
import { obtenerToken } from "../utils/auth";

import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import SearchIcon from "@mui/icons-material/Search";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

import { DatosPemar } from "./DatosPemar";

function formatearNumero(numero) {
  if (numero == null || numero == undefined) {
    return "0";
  }
  if (numero.toString().indexOf(",") !== -1) {
    return numero.toString();
  }
  if (numero % 1 !== 0) {
    const partes = numero.toFixed(2).split(".");
    const parteEntera = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${parteEntera},${partes[1]}`;
  }
  return `${numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")},00`;
}

import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
export function BuscarPemar({ codigoProyecto, esVivienda, esPemar }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const count = useSelector((state) => state.counter.value);

  const [datoscontratoData, setDatoscontratoData] = useState([]);
  const [selectedCodid, setSelectedCodid] = useState(null);
  const [titulo, setTitulo] = useState(null);

  const [updateComponent, setUpdateComponent] = useState(0);
  const [desabilitarAEV, setDesabilitarAEV] = useState(true);

  const [expandedPanels, setExpandedPanels] = useState({});
  const [errorSearch, setErrorSearch] = useState(null);

  const [value, setValue] = useState(0);

  const handleChange = (index) => (isExpanded) => {
    setExpandedPanels({
      ...expandedPanels,
      [index]: isExpanded,
    });
  };
  useEffect(() => {
    const handleSearch = async () => {
      try {
        const url = `${apiKey}/cuadro/consultacuadro/${codigoProyecto}`;
        const token = obtenerToken();
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(url, { headers });

        if (response.status === 200) {
          setErrorSearch(null);
          setDatoscontratoData(response.data);
          setSelectedCodid(0);
          if (response.data && response.data.length > 0) {
            setTitulo(response.data[0].proyecto_nombre);
          }
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 400) {
            setErrorSearch(`RS: ${data.message}`);
          } else if (status === 500) {
            setErrorSearch(`RS: ${data.message}`);
          }
        } else if (error.request) {
          setErrorSearch("RF: No se pudo obtener respuesta del servidor");
        } else {
          setErrorSearch("RF: Error al enviar la solicitud");
        }
      }
    };
    handleSearch();
  }, []);

  const handleUploadPDFs = (dataContCod) => {
    setSelectedCodid(dataContCod);
    setUpdateComponent((prev) => prev + 1);
  };

  useEffect(() => {
    handleUploadPDFs(selectedCodid);
  }, [count]);

  const elementosPorConjunto = 2;
  const conjuntosDatos = [];
  for (let i = 0; i < datoscontratoData.length; i += elementosPorConjunto) {
    conjuntosDatos.push(datoscontratoData.slice(i, i + elementosPorConjunto));
  }

  const handleChange2 = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {errorSearch && (
        <p className="text-red-700 text-center p-5">{errorSearch}</p>
      )}
      <Typography className="p-3 text-c600 text-2xl" variant="h5" gutterBottom>
        INFORMACION DEL PROYECTO:
      </Typography>
      <Box
        component={"div"}
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: { md: "flex" },
        }}
      >
        <Tabs
          sx={{
            borderRight: 1,
            borderColor: "divider",
            minWidth: 200,
            height: { md: 160 },
          }}
          orientation={window.innerWidth < 600 ? "horizontal" : "vertical"}
          variant="scrollable"
          value={value}
          onChange={handleChange2}
          aria-label="Vertical tabs example"
        >
          {datoscontratoData.map((item, index) => (
            <Tab key={index} label={item.num} {...a11yProps(index)} />
          ))}
        </Tabs>
        {datoscontratoData.map((item, index) => (
          <TabPanel key={index} value={value} index={index}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid xs={12} md={2}>
                  <Button
                    size="small"
                    color="success"
                    variant="outlined"
                    onClick={() => handleUploadPDFs(item.id)}
                  >
                    Seleccionar
                  </Button>
                </Grid>
                <Grid xs={12} md={10}>
                  <Typography variant="caption" display="block" gutterBottom>
                    PROYECTO: {item.proyecto_nombre}
                  </Typography>
                  <br />
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography variant="caption" display="block" gutterBottom>
                    {item.uh_proy ? (
                      <>
                        UH: {item.uh_proy} <br />
                      </>
                    ) : null}
                    {item.gestion ? (
                      <>
                        GESTION: {item.gestion} <br />
                      </>
                    ) : null}
                    {item.departamento ? (
                      <>
                        DEPARTAMENTO: {item.departamento} <br />
                      </>
                    ) : null}
                    {item.municipio ? (
                      <>
                        MUNICIPIO: {item.municipio} <br />
                      </>
                    ) : null}
                  </Typography>
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography variant="caption" display="block" gutterBottom>
                    {item.monto_contrato_aevivienda ? (
                      <>
                        CONTRATO INICIAL Bs:{" "}
                        {formatearNumero(item.monto_contrato_aevivienda)} <br />
                      </>
                    ) : null}
                    {item.monto_cont_modificatorio ? (
                      <>
                        MODIFICATORIO Bs:{" "}
                        {formatearNumero(item.monto_cont_modificatorio)} <br />
                      </>
                    ) : null}
                    {item.estado ? (
                      <>
                        ESTADO: {item.estado} <br />
                      </>
                    ) : null}
                    {item.id ? (
                      <>
                        ID: {item.id} <br />
                      </>
                    ) : null}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <br />
          </TabPanel>
        ))}
      </Box>
      <br />
      <DatosPemar
        key={updateComponent}
        selectedCodid={selectedCodid}
        titulo={titulo}
        codigoProyecto={codigoProyecto}
        esPemar={esPemar}
        esVivienda={esVivienda}
      />
      <br />
    </>
  );
}
