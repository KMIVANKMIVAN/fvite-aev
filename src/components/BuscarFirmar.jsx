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

import { DatosBusa } from "./DatosBusa";
import { DatosComplViviend } from "./DatosComplViviend";
import { DatosPemar } from "./DatosPemar";

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
export function BuscarFirmar() {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const count = useSelector((state) => state.counter.value);

  const [datoscontratoData, setDatoscontratoData] = useState([]);
  const [selectedContCod, setSelectedContCod] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  const [titulo, setTitulo] = useState(null);
  const [selectedCodid, setSelectedCodid] = useState(null);

  const [tipoPemar, setTipoPemar] = useState(false);
  const [tipoVivien, setTipoVivien] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [updateComponent, setUpdateComponent] = useState(0);
  //
  const [datosBusa, setDatosBusa] = useState(false);

  const [expandedPanels, setExpandedPanels] = useState({});
  //
  const handleChange = (index) => (event, isExpanded) => {
    setExpandedPanels({
      ...expandedPanels,
      [index]: isExpanded,
    });
  };
  //
  const handleExpandClick = (index) => {
    setExpandedItems({
      ...expandedItems,
      [index]: !expandedItems[index],
    });
  };

  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const handleSearch = async () => {
    try {
      const url = `${apiKey}/documentpdf/buscar/${inputValue}`;
      const response = await axios.get(url, { headers });

      if (response.status === 200) {
        setDatoscontratoData(response.data);
        setSelectedContCod(0);
      }
    } catch (error) {
      // console.error("Error:", error);
    }
  };

  useEffect(() => {
    const datosparabusa = async () => {
      try {
        const urlTipoRespaldo = `${apiKey}/cuadro/consultabusa`;

        const response = await axios.get(urlTipoRespaldo, { headers });

        if (response.status === 200) {
          setDatosBusa(response.data);
        }
      } catch (error) {
        setDatosBusa(`RS: ${error}`);
      }
    };

    datosparabusa();
  }, []);

  // console.log("datosBusa", datosBusa);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  /* const handleUploadPDFs = (dataContCod) => {
    console.log("selectedContCod", selectedContCod);
    setSelectedContCod(dataContCod);
    setUpdateComponent((prev) => prev + 1);
  }; */
  const handleUploadPDFs = (dataContCod) => {
    setSelectedContCod(dataContCod);

    // Verificar si datosBusa es un array antes de usar find
    if (Array.isArray(datosBusa) && datosBusa.length > 0) {
      // Encuentra el elemento correspondiente a dataContCod en datosBusa
      const selectedData = datosBusa.find(
        (data) => data.cont_cod === dataContCod
      );

      // Verifica si selectedData contiene "P.M.A.R." en el texto
      const esPemar = selectedData && selectedData.tipo.includes("P.M.A.R.");
      // Verifica si selectedData contiene "Vivienda Nueva" en el texto
      const esViviendaNueva =
        selectedData && selectedData.tipo.includes("Vivienda Nueva");

      // Actualiza los estados según las condiciones
      if (esPemar) {
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

  // Dividir los datos en conjuntos de acuerdo al número de elementos por conjunto
  const conjuntosDatos = [];
  for (let i = 0; i < datosBusa.length; i += elementosPorConjunto) {
    conjuntosDatos.push(datosBusa.slice(i, i + elementosPorConjunto));
  }

  return (
    <>
      {/*  <h2 className="p-3 text-mi-color-terceario text-2xl font-bold">Buscar</h2>
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
      <br /> */}
      <div className="flex min-h-full flex-col justify-center px-1 py-1 lg:px-4">
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
                      {data.codigo && (
                        <>
                          <strong className="text-mi-color-secundario">
                            CODIGO:
                          </strong>{" "}
                          {data.codigo}
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
                      {data.nombre_proyecto}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                      }}
                    >
                      <Grid container spacing={2} key={conjuntoIndex}>
                        <Grid item xs={12} md={6}>
                          {data.tipo && (
                            <>
                              <strong className="text-mi-color-secundario">
                                TIPO
                              </strong>{" "}
                              {data.tipo}
                              <br />
                            </>
                          )}
                          {data.id_desembolso && (
                            <>
                              <strong className="text-mi-color-secundario">
                                ID DESEMBOLSO
                              </strong>{" "}
                              {data.id_desembolso}
                              <br />
                            </>
                          )}
                          <strong className="text-mi-color-secundario">
                            DESCUENTO ANTICIPO RETENCION:
                          </strong>{" "}
                          {formatearNumero(data.descuento_anti_reten)}
                          <br />
                          {data.monto_desembolsado && (
                            <>
                              <strong className="text-mi-color-secundario">
                                MONTO DESEMBOLSADO:
                              </strong>{" "}
                              {formatearNumero(data.monto_desembolsado)}
                              <br />
                            </>
                          )}
                          {data.titular && (
                            <>
                              <strong className="text-mi-color-secundario">
                                TITULAR:
                              </strong>{" "}
                              {data.titular}
                              <br />
                            </>
                          )}
                          {data.idcuenta && (
                            <>
                              <strong className="text-mi-color-secundario">
                                ID DE CUENTA:
                              </strong>{" "}
                              {data.idcuenta}
                              <br />
                            </>
                          )}
                          {data.numero_inst && (
                            <>
                              <strong className="text-mi-color-secundario">
                                NUMERO DE INST:
                              </strong>{" "}
                              {data.numero_inst}
                              <br />
                            </>
                          )}
                          {data.fecha_insert && (
                            <>
                              <strong className="text-mi-color-secundario">
                                FECHA DE INSERT:
                              </strong>{" "}
                              {data.fecha_insert}
                              <br />
                            </>
                          )}
                          {data.fecha_banco && (
                            <>
                              <strong className="text-mi-color-secundario">
                                FECHA BANCO:
                              </strong>{" "}
                              {data.fecha_banco}
                              <br />
                            </>
                          )}
                          {data.fecha_busa && (
                            <>
                              <strong className="text-mi-color-secundario">
                                FECHA BUSA:
                              </strong>{" "}
                              {data.fecha_busa}
                              <br />
                            </>
                          )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                          {data.id_proyecto && (
                            <>
                              <strong className="text-mi-color-secundario">
                                ID:
                              </strong>{" "}
                              {data.id_proyecto}
                              <br />
                            </>
                          )}
                          {data.cont_cod && (
                            <>
                              <strong className="text-mi-color-secundario">
                                CONT CODIGO:
                              </strong>{" "}
                              {data.cont_cod}
                              <br />
                            </>
                          )}
                          {data.monto_fisico && (
                            <>
                              <strong className="text-mi-color-secundario">
                                MONTO FISICO:
                              </strong>{" "}
                              {formatearNumero(data.monto_fisico)}
                              <br />
                            </>
                          )}
                          <strong className="text-mi-color-secundario">
                            MULTA:
                          </strong>{" "}
                          {formatearNumero(data.multa)}
                          <br />
                          {data.cuentatitular && (
                            <>
                              <strong className="text-mi-color-secundario">
                                CUENTA TITULAR:
                              </strong>{" "}
                              {data.cuentatitular}
                              <br />
                            </>
                          )}
                          {data.estado && (
                            <>
                              <strong className="text-mi-color-secundario">
                                ESTADO:
                              </strong>{" "}
                              {data.estado}
                              <br />
                            </>
                          )}
                          {data.numero_factura && (
                            <>
                              <strong className="text-mi-color-secundario">
                                NUMERO DE FACTURA:
                              </strong>{" "}
                              {data.numero_factura}
                              <br />
                            </>
                          )}
                          {data.fecha_abono && (
                            <>
                              <strong className="text-mi-color-secundario">
                                FECHA ABONO:
                              </strong>{" "}
                              {data.fecha_abono}
                              <br />
                            </>
                          )}
                          {data.archivo && (
                            <>
                              <strong className="text-mi-color-secundario">
                                ARCHIVO:
                              </strong>{" "}
                              {data.archivo}
                              <br />
                            </>
                          )}
                          {data.archivo_busa && (
                            <>
                              <strong className="text-mi-color-secundario">
                                ARCHIVO BUSA:
                              </strong>{" "}
                              {data.archivo_busa}
                              <br />
                            </>
                          )}
                          {data.objeto && (
                            <>
                              <strong className="text-mi-color-secundario">
                                OBJETO:
                              </strong>{" "}
                              {data.objeto}
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
      {tipoPemar && (
        <DatosPemar
          key={updateComponent}
          selectedCodid={selectedCodid}
          titulo={titulo}
        />
      )}
      {tipoVivien && (
        <DatosComplViviend
          key={updateComponent}
          selectedContCod={selectedContCod}
        />
      )}
      <br />
    </>
  );
}
