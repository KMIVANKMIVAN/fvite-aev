import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import axios from "axios";
import { obtenerToken } from "../utils/auth";

import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import SearchIcon from "@mui/icons-material/Search";

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

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Grid from "@mui/material/Grid";
export function BuscarPemar({ codigoProyecto }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const count = useSelector((state) => state.counter.value);

  const [datoscontratoData, setDatoscontratoData] = useState([]);
  const [selectedCodid, setSelectedCodid] = useState(null);
  const [titulo, setTitulo] = useState(null);

  const [inputValue, setInputValue] = useState("");
  const [updateComponent, setUpdateComponent] = useState(0);
  const [desabilitarAEV, setDesabilitarAEV] = useState(true);

  const [expandedPanels, setExpandedPanels] = useState({});
  const [errorSearch, setErrorSearch] = useState(null);

  const handleChange = (index) => (isExpanded) => {
    setExpandedPanels({
      ...expandedPanels,
      [index]: isExpanded,
    });
  };
  const handleSearch = async () => {
    try {
      const url = `${apiKey}/cuadro/consultacuadro/${inputValue}`;
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

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

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

  return (
    <>
      {errorSearch && (
        <p className="text-red-700 text-center p-5">{errorSearch}</p>
      )}
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
      <br />
      <DatosPemar
        key={updateComponent}
        selectedCodid={selectedCodid}
        titulo={titulo}
        desabilitarAEV={desabilitarAEV}
      />
      <br />
    </>
  );
}
