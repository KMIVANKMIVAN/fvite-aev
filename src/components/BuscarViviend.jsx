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

export function BuscarViviend({ codigoProyecto, esVivienda, esPemar }) {
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
      <DatosComplViviend
        key={updateComponent}
        selectedContCod={selectedContCod}
        codigoProyecto={codigoProyecto}
        esVivienda={esVivienda}
        esPemar={esPemar}
      />
      <br />
    </>
  );
}
