import { useState, useEffect } from "react";
// import * as React from "react";
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

import Button from "@mui/material/Button";

import axios from "axios";
import { obtenerToken } from "../utils/auth";

import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { DatosComplViviend } from "./DatosComplViviend";
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

function formatearFecha(fecha) {
  // Convierte la cadena de fecha en un objeto de fecha
  const fechaObjeto = new Date(fecha);

  // Obtiene los componentes de la fecha
  const dia = fechaObjeto.getUTCDate().toString().padStart(2, "0");
  const mes = (fechaObjeto.getUTCMonth() + 1).toString().padStart(2, "0");
  const año = fechaObjeto.getUTCFullYear();
  const horas = fechaObjeto.getUTCHours().toString().padStart(2, "0");
  const minutos = fechaObjeto.getUTCMinutes().toString().padStart(2, "0");
  const segundos = fechaObjeto.getUTCSeconds().toString().padStart(2, "0");

  // Formatea la fecha en el formato deseado
  const fechaFormateada = `${mes}-${dia}-${año} ${horas}:${minutos}:${segundos}`;

  return fechaFormateada;
}

import { useSelector } from "react-redux";

import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Container from "@mui/material/Container";
export function BuscarFirmar() {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const count = useSelector((state) => state.counter.value);

  const [selectedContCod, setSelectedContCod] = useState(null);

  const [titulo, setTitulo] = useState(null);
  const [selectedCodid, setSelectedCodid] = useState(null);

  const [tipoPemar, setTipoPemar] = useState(false);
  const [tipoVivien, setTipoVivien] = useState(false);

  const [updateComponent, setUpdateComponent] = useState(0);

  const [datosBusa, setDatosBusa] = useState([]);
  const [errorDatosBusa, setErrorDatosBusa] = useState(null);

  const [expandedPanels, setExpandedPanels] = useState({});
  const [desabilitarBUSA, setDesabilitarBUSA] = useState(true);

  const [value, setValue] = useState(0);

  const theme = useTheme();

  const handleChange2 = (event, newValue) => {
    // setUpdateComponent(0);
    setTipoPemar(false);
    setTipoVivien(false);
    setValue(newValue);
  };

  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const datosparabusa = async () => {
      try {
        const urlTipoRespaldo = `${apiKey}/cuadro/consultabusa`;
        const response = await axios.get(urlTipoRespaldo, { headers });
        if (response.status === 200) {
          setErrorDatosBusa(null);
          setDatosBusa(response.data);
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 400) {
            setErrorDatosBusa(`RS: ${data.message}`);
          } else if (status === 500) {
            setErrorDatosBusa(`RS: ${data.message}`);
          }
        } else if (error.request) {
          setErrorDatosBusa("RF: No se pudo obtener respuesta del servidor");
        } else {
          setErrorDatosBusa("RF: Error al enviar la solicitud");
        }
      }
    };

    datosparabusa();
  }, []);
  const handleUploadPDFs = (dataContCod) => {
    setUpdateComponent(0);
    setSelectedContCod(dataContCod);

    if (Array.isArray(datosBusa) && datosBusa.length > 0) {
      const selectedData = datosBusa.find(
        (data) => data.cont_cod === dataContCod
      );

      const esPemar = selectedData && selectedData.tipo.includes("P.M.A.R.");
      const esViviendaNueva =
        selectedData && selectedData.tipo.includes("Vivienda Nueva");
      if (esPemar) {
        console.log("entro a qui pemar");
        setTipoPemar(true);
        setTipoVivien(false);
        setTitulo(selectedData.nombre_proyecto);
        setSelectedCodid(selectedData.id_proyecto);
      } else if (esViviendaNueva) {
        setTipoPemar(false);
        setTipoVivien(true);
      }
    }

    setUpdateComponent((prev) => prev + 1);
  };

  useEffect(() => {
    handleUploadPDFs(selectedContCod);
  }, [count]);

  const elementosPorConjunto = 2;

  const conjuntosDatos = [];
  for (let i = 0; i < datosBusa.length; i += elementosPorConjunto) {
    conjuntosDatos.push(datosBusa.slice(i, i + elementosPorConjunto));
  }

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-1 py-1 lg:px-4">
        {errorDatosBusa && (
          <p className="text-red-700 text-center p-5">{errorDatosBusa}</p>
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
            // orientation={{ md: "column", xs: "row" }}
            sx={{
              // display: "flex",
              // flexDirection: { xs: "column", md: "row" },
              borderRight: 1,
              borderColor: "divider",
              minWidth: 190,
              height: { md: 300 },
            }}
            /* orientation={
              theme.breakpoints.down("sm") ? "horizontal" : "vertical"
            } */
            orientation={window.innerWidth < 600 ? "horizontal" : "vertical"}
            // orientation={{ xs: "horizontal", md: "vertical" }[breakpoint]}
            variant="scrollable"
            value={value}
            onChange={handleChange2}
            aria-label="Vertical tabs example"
          >
            {datosBusa.map((item, index) => (
              <Tab key={index} label={item.codigo} {...a11yProps(index)} />
            ))}
          </Tabs>
          {datosBusa.map((item, index) => (
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
                      PROYECTO: {item.nombre_proyecto}
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Typography variant="caption" display="block" gutterBottom>
                      {item.tipo ? (
                        <>
                          TIPO: {item.tipo} <br />
                        </>
                      ) : null}
                      {item.descuento_anti_reten ? (
                        <>
                          DESCUENTO ANTICIPO RETENCION:
                          {formatearNumero(item.descuento_anti_reten)} <br />
                        </>
                      ) : null}
                      {item.idcuenta ? (
                        <>
                          ID DE CUENTA: {item.idcuenta} <br />
                        </>
                      ) : null}
                      {item.fecha_insert ? (
                        <>
                          FECHA DE INSERT: {formatearFecha(item.fecha_insert)} <br />
                        </>
                      ) : null}
                      {item.fecha_busa ? (
                        <>
                          FECHA BUSA: {formatearFecha(item.fecha_busa)} <br />
                        </>
                      ) : null}
                      {item.cont_cod ? (
                        <>
                          CONT CODIGO: {item.cont_cod} <br />
                        </>
                      ) : null}
                      {item.multa ? (
                        <>
                          MULTA: {formatearNumero(item.multa)} <br />
                        </>
                      ) : null}
                      {item.estado ? (
                        <>
                          ESTADO: {item.estado} <br />
                        </>
                      ) : null}
                      {item.archivo ? (
                        <>
                          ARCHIVO: {item.archivo} <br />
                        </>
                      ) : null}
                      {item.archivo_busa ? (
                        <>
                          ARCHIVO BUSA: {item.archivo_busa} <br />
                        </>
                      ) : null}
                      {/* {item. && <> {item.}</>} */}
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Typography variant="caption" display="block" gutterBottom>
                      {item.id_desembolso ? (
                        <>
                          ID DESEMBOLSO: {item.id_desembolso} <br />
                        </>
                      ) : null}
                      {item.titular ? (
                        <>
                          TITULAR: {item.titular} <br />
                        </>
                      ) : null}
                      {item.numero_inst ? (
                        <>
                          NUMERO DE INST: {item.numero_inst} <br />
                        </>
                      ) : null}
                      {item.fecha_banco ? (
                        <>
                          FECHA BANCO: {formatearFecha(item.fecha_banco)} <br />
                        </>
                      ) : null}
                      {item.id_proyecto ? (
                        <>
                          ID: {item.id_proyecto} <br />
                        </>
                      ) : null}
                      {item.monto_fisico ? (
                        <>
                          MONTO FISICO: {formatearNumero(item.monto_fisico)}{" "}
                          <br />
                        </>
                      ) : null}
                      {item.cuentatitular ? (
                        <>
                          CUENTA TITULAR: {item.cuentatitular} <br />
                        </>
                      ) : null}
                      {item.numero_factura ? (
                        <>
                          NUMERO DE FACTURA: {item.numero_factura} <br />
                        </>
                      ) : null}
                      {item.fecha_abono ? (
                        <>
                          FECHA ABONO:{" "}
                          {formatearFecha(item.fecha_bufecha_abonosa)} <br />
                        </>
                      ) : null}

                      {/* {item. && <> {item.}</>} */}
                    </Typography>
                  </Grid>
                  <Grid xs={12}>
                    <Typography variant="caption" display="block" gutterBottom>
                      {item.objeto ? (
                        <>
                          OBJETO: {item.objeto}
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
      </div>
      {tipoPemar && (
        <DatosPemar
          key={updateComponent}
          selectedCodid={selectedCodid}
          titulo={titulo}
          desabilitarBUSA={desabilitarBUSA}
        />
      )}
      {tipoVivien && (
        <DatosComplViviend
          key={updateComponent}
          selectedContCod={selectedContCod}
          desabilitarBUSA={desabilitarBUSA}
        />
      )}
      <br />
    </>
  );
}
