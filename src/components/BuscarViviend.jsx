import { useState, useEffect } from "react";
import Button from "@mui/material/Button";

import axios from "axios";
import { obtenerToken } from "../utils/auth";

import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

import { DatosComplViviend } from "./DatosComplViviend";

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

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Grid from "@mui/material/Grid";

export function BuscarViviend({ codigoProyecto }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const count = useSelector((state) => state.counter.value);

  const [datoscontratoData, setDatoscontratoData] = useState([]);
  const [selectedContCod, setSelectedContCod] = useState(null);

  const [searchError, setErrorSearch] = useState(null);

  const [updateComponent, setUpdateComponent] = useState(0);
  const [expandedPanels, setExpandedPanels] = useState({});
  const [desabilitarAEV, setDesabilitarAEV] = useState(true);

  const [value, setValue] = useState(0);

  const handleChange = (index) => (event, isExpanded) => {
    setExpandedPanels({
      ...expandedPanels,
      [index]: isExpanded,
    });
  };
  useEffect(() => {
    const handleSearch = async () => {
      try {
        const url = `${apiKey}/documentpdf/buscar/${codigoProyecto}`;
        const token = obtenerToken();
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(url, { headers });

        if (response.status === 200) {
          setErrorSearch(null);
          setDatoscontratoData(response.data);
          setSelectedContCod(0);
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
    setSelectedContCod(dataContCod);
    setUpdateComponent((prev) => prev + 1);
  };

  useEffect(() => {
    handleUploadPDFs(selectedContCod);
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
      {searchError && (
        <p className="text-red-700 text-center p-5">{searchError}</p>
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
            height: { md: 200 },
          }}
          orientation={window.innerWidth < 600 ? "horizontal" : "vertical"}
          variant="scrollable"
          value={value}
          onChange={handleChange2}
          aria-label="Vertical tabs example"
        >
          {datoscontratoData.map((item, index) => (
            <Tab key={index} label={item.proy_cod} {...a11yProps(index)} />
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
                    onClick={() => handleUploadPDFs(item.cont_cod)}
                  >
                    Seleccionar
                  </Button>
                </Grid>
                <Grid xs={12} md={10}>
                  <Typography variant="caption" display="block" gutterBottom>
                    PROYECTO: {item.cont_des}
                  </Typography>
                  <br />
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography variant="caption" display="block" gutterBottom>
                    ESTADO SAP: {item.id}
                    {item.montocontrato ? (
                      <>
                        MONTO CONTRATO Bs: {formatearNumero(item.montocontrato)}{" "}
                        <br />
                      </>
                    ) : null}
                    {item.bole_fechav ? (
                      <>
                        ULTIMA BOLETA: {item.bole_fechav} <br />
                      </>
                    ) : null}
                    {item.etap_cod ? (
                      <>
                        ESTADO SAP: {item.etap_cod} <br />
                      </>
                    ) : null}
                  </Typography>
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography variant="caption" display="block" gutterBottom>
                    {item.inst_des ? (
                      <>
                        EMPRESA: {item.inst_des} <br />
                      </>
                    ) : null}
                    {item.depa_des ? (
                      <>
                        DEPARTAMENTO: {item.depa_des} <br />
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
      {/* <div className="flex min-h-full flex-col justify-center px-1 py-1 lg:px-4">
        {conjuntosDatos.map((conjunto, conjuntoIndex) => (
          <Grid container spacing={2} key={conjuntoIndex}>
            {conjunto.map((data, index) => (
              <Grid item xs={12} sm={12} md={6} key={index} className="py-2">
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
                    <Typography
                      sx={{
                        width: "33%",
                        flexShrink: 0,
                        fontSize: "0.75rem",
                      }}
                    >
                      {data.proy_cod && (
                        <>
                          <strong className="text-mi-color-secundario">
                            CODIGO:
                          </strong>{" "}
                          {data.proy_cod}
                        </>
                      )}
                      <Button
                        size="small"
                        color="success"
                        variant="outlined"
                        onClick={() => handleUploadPDFs(data.cont_cod)}
                      >
                        Seleccionar
                      </Button>
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem" }}>
                      <strong className="text-mi-color-secundario">
                        PROYECTO:
                      </strong>{" "}
                      {data.cont_des}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                      }}
                    >
                      <Grid container spacing={2} key={conjuntoIndex}>
                        <Grid item xs={6}>
                          {data.montocontrato && (
                            <>
                              <strong className="text-mi-color-secundario">
                                MONTO CONTRATO Bs.
                              </strong>{" "}
                              {formatearNumero(data.montocontrato)}
                              <br />
                            </>
                          )}
                          {data.bole_fechav && (
                            <>
                              <strong className="text-mi-color-secundario">
                                ULTIMA BOLETA:
                              </strong>{" "}
                              {data.bole_fechav}
                              <br />
                            </>
                          )}
                        </Grid>
                        <Grid item xs={6}>
                          {data.etap_cod && (
                            <>
                              <strong className="text-mi-color-secundario">
                                ESTADO SAP:
                              </strong>{" "}
                              {data.etap_cod}
                              <br />
                            </>
                          )}
                          {data.depa_des && (
                            <>
                              <strong className="text-mi-color-secundario">
                                DEPARTAMENTO:
                              </strong>{" "}
                              {data.depa_des}
                              <br />
                            </>
                          )}
                          {data.inst_des && (
                            <>
                              <strong className="text-mi-color-secundario">
                                EMPRESA:
                              </strong>{" "}
                              {data.inst_des}
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
      <DatosComplViviend
        key={updateComponent}
        selectedContCod={selectedContCod}
        desabilitarAEV={desabilitarAEV}
        codigoProyecto={codigoProyecto}
      />
      <br />
    </>
  );
}
