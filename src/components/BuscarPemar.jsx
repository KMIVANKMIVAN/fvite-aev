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
export function BuscarPemar({ codigoProyecto }) {
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
      {/*  <div className="flex min-h-full flex-col justify-center px-1 py-1 lg:px-4">
        {conjuntosDatos.map((conjunto, conjuntoIndex) => (
          <Grid container spacing={2} key={conjuntoIndex}>
            {conjunto.map((data, index) => (
              <Grid item xs={12} key={index} className="py-2">
                <Accordion
                  expanded={expandedPanels[index]}
                  onChange={handleChange(index)}
                  elevation={24}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}bh-content`}
                    id={`panel${index}bh-header`}
                  >
                    <Grid container spacing={2} key={conjuntoIndex}>
                      <Grid item xs={6} md={2}>
                        <Typography sx={{ fontSize: "0.75rem" }}>
                          <Button
                            size="small"
                            color="success"
                            variant="outlined"
                            onClick={() => handleUploadPDFs(data.id)}
                          >
                            Seleccionar
                          </Button>
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <Typography sx={{ fontSize: "0.75rem" }}>
                          {data.num && (
                            <>
                              <strong className="text-mi-color-secundario">
                                CODIGO:
                              </strong>{" "}
                              {data.num}
                            </>
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Typography sx={{ fontSize: "0.75rem" }}>
                          <strong className="text-mi-color-secundario">
                            PROYECTO:
                          </strong>{" "}
                          {data.proyecto_nombre}
                        </Typography>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                      }}
                    >
                      <Grid container spacing={2} key={conjuntoIndex}>
                        <Grid item xs={6} md={3}>
                          <strong className="text-mi-color-secundario">
                            UH
                          </strong>{" "}
                          {formatearNumero(data.uh_proy)}
                        </Grid>
                        <Grid item xs={6} md={3}>
                          {data.gestion && (
                            <>
                              <strong className="text-mi-color-secundario">
                                GESTION:
                              </strong>{" "}
                              {data.gestion}
                              <br />
                            </>
                          )}
                        </Grid>
                        <Grid item xs={6} md={3}>
                          {data.departamento && (
                            <>
                              <strong className="text-mi-color-secundario">
                                DEPARTAMENTO:
                              </strong>{" "}
                              {data.departamento}
                              <br />
                            </>
                          )}
                        </Grid>
                        <Grid item xs={6} md={3}>
                          {data.municipio && (
                            <>
                              <strong className="text-mi-color-secundario">
                                MUNICIPIO:
                              </strong>{" "}
                              {data.municipio}
                              <br />
                            </>
                          )}
                        </Grid>
                        <Grid item xs={6} md={3}>
                          {data.monto_contrato_aevivienda && (
                            <>
                              <strong className="text-mi-color-secundario">
                                CONTRATO INICIAL Bs:
                              </strong>{" "}
                              {data.monto_contrato_aevivienda != null
                                ? formatearNumero(
                                    data.monto_contrato_aevivienda
                                  )
                                : "0"}
                              <br />
                            </>
                          )}
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <strong className="text-mi-color-secundario">
                            MODIFICATORIO Bs:
                          </strong>{" "}
                          {data.monto_cont_modificatorio != null
                            ? formatearNumero(data.monto_cont_modificatorio)
                            : "0"}
                          <br />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          {data.estado && (
                            <>
                              <strong className="text-mi-color-secundario">
                                ESTADO:
                              </strong>{" "}
                              {data.estado}
                              <br />
                            </>
                          )}
                        </Grid>
                        <Grid item xs={6} md={3}>
                          {data.id && (
                            <>
                              <strong className="text-mi-color-secundario">
                                ID:
                              </strong>{" "}
                              {data.id}
                              <br />
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))}
          </Grid>
        ))}
      </div>
      <br />
      <br /> */}
      <DatosPemar
        key={updateComponent}
        selectedCodid={selectedCodid}
        titulo={titulo}
        desabilitarAEV={desabilitarAEV}
        codigoProyecto={codigoProyecto}
      />
      <br />
    </>
  );
}
