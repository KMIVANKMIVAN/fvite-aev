import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";

import axios from "axios";
import { obtenerToken } from "../utils/auth";

import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import SearchIcon from "@mui/icons-material/Search";

import { DatosComplViviend } from "./DatosComplViviend";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function formatearNumero(numero) {
  const esDecimal = numero % 1 !== 0;

  if (esDecimal) {
    const partes = numero.toFixed(2).split(".");
    const parteEntera = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${parteEntera},${partes[1]}`;
  }

  return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

import { useSelector } from "react-redux";

///////////////////////////////
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Grid from "@mui/material/Grid";
//
export function BuscarViviend() {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const count = useSelector((state) => state.counter.value);

  const [datoscontratoData, setDatoscontratoData] = useState([]);
  const [selectedContCod, setSelectedContCod] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  const [inputValue, setInputValue] = useState("");
  const [updateComponent, setUpdateComponent] = useState(0);
  //
  const [expanded, setExpanded] = useState(false);

  const [expandedPanels, setExpandedPanels] = useState({});
  //
  const handleChange = (panel) => (event, isExpanded) => {
    setExpandedPanels({
      ...expandedPanels,
      [panel]: isExpanded,
    });
  };
  //
  const handleExpandClick = (index) => {
    setExpandedItems({
      ...expandedItems,
      [index]: !expandedItems[index],
    });
  };

  const handleSearch = async () => {
    try {
      const url = `${apiKey}/documentpdf/buscar/${inputValue}`;
      const token = obtenerToken();
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });

      if (response.status === 200) {
        setDatoscontratoData(response.data);
        setSelectedContCod(0);
      }
    } catch (error) {
      // console.error("Error:", error);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleUploadPDFs = (dataContCod) => {
    setSelectedContCod(dataContCod);
    setUpdateComponent((prev) => prev + 1);
  };

  useEffect(() => {
    handleUploadPDFs(selectedContCod);
  }, [count]);

  const elementosPorConjunto = 2;

  // Dividir los datos en conjuntos de acuerdo al número de elementos por conjunto
  const conjuntosDatos = [];
  for (let i = 0; i < datoscontratoData.length; i += elementosPorConjunto) {
    conjuntosDatos.push(datoscontratoData.slice(i, i + elementosPorConjunto));
  }

  return (
    <>
      <h2 className="p-3 text-mi-color-terceario text-2xl font-bold">Buscar</h2>
      <div className="col-span-1 flex justify-center px-10">
        <TextField
          name="codigo"
          helperText="Ejemplo: AEV-LP-0000 o FASE(XIII)..."
          id="standard-basic"
          label="Codigo de Proyecto (COMPLETO) o Nombre de Proyecto:"
          variant="standard"
          className="w-full"
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex justify-center pt-5">
        <Button
          variant="outlined"
          onClick={handleSearch}
          endIcon={<SearchIcon />}
        >
          Buscar
        </Button>
      </div>
      <br />
      <div className="flex min-h-full flex-col justify-center px-1 py-1 lg:px-4">
        {conjuntosDatos.map((conjunto, conjuntoIndex) => (
          <Grid container spacing={2} key={conjuntoIndex}>
            {conjunto.map((data, index) => (
              <Grid item xs={12} sm={12} md={6} key={index}>
                <Accordion
                  expanded={expandedPanels[`panel${index}`]}
                  onChange={handleChange(`panel${index}`)}
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
      <br />
      <DatosComplViviend
        key={updateComponent}
        selectedContCod={selectedContCod}
      />
      <br />
    </>
  );
}
