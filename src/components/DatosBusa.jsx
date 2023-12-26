import React, { useState, useEffect, useRef } from "react";

import axios from "axios";
import { obtenerToken } from "../utils/auth";

import { BajarEliminarAnexos } from "./BajarEliminarAnexos";

import { SubirBajarEliminarPdf } from "./SubirBajarEliminarPdf";
import { AnexsosPdf } from "./AnexsosPdf";

import { makeStyles } from "@material-ui/core/styles";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";

import { EnviarBanco } from "./EnviarBanco";

import { Instructivo } from "./Instructivo";
import { VerificarInstr } from "./VerificarInstr";

import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    // maxHeight: 440,
  },
  tableCell: {
    fontSize: "0.75rem",
  },
});

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

export function DatosBusa({ selectedContCod }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const count = useSelector((state) => state.counter.value);

  const [contcodComplejaData, setContcodComplejaData] = useState([]);

  const [errorcontcodComplejaData, setErrorContcodComplejaData] = useState([]);

  const [nombrePdfSeleccionado, setNombrePdfSeleccionado] = useState(null);
  const [forceRender, setForceRender] = useState(false);

  const [respuestas, setRespuestas] = useState(null);
  const [respuestasError, setErrorRespuestas] = useState(null);
  const [verificarenviobanco, setVerificarenviobanco] = useState(null);
  const [errorVerificarbanco, setErrorverificarbanco] = useState(null);

  const [open, setOpen] = useState(false);
  const [disanble, setDisanble] = useState(true);

  const instructivoRef = useRef(null);

  const classes = useStyles();

  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchData = async () => {
      if (selectedContCod) {
        try {
          const url = `${apiKey}/datoscontrato/compleja/${selectedContCod}`;

          const response = await axios.get(url, { headers });

          if (response.status === 200) {
            setContcodComplejaData(response.data);
          } else {
            setErrorContcodComplejaData(
              `Error en el estado de respuesta, estado: ${response.statusText}`
            );
          }
        } catch (error) {
          setErrorContcodComplejaData(`Error del servidor: ${error}`);
        }
      }
    };

    fetchData();
  }, [selectedContCod]);

  if (contcodComplejaData.length === 0 || selectedContCod === 0) {
    return null;
  }

  let totalMulta = 0;
  let totalDescuentoAntiReten = 0;
  let totalMontoFisico = 0;
  let totalMontoDesembolsado = 0;

  const columns = [
    { id: "id_aevbanco", label: "ENVIAR AL BANCO", minWidth: 200 },
    { id: "iddesem_aev", label: "INSTRUCTIVO DESEMBOLSO AEV", minWidth: 150 },
    { id: "iddesem_anexo", label: "ANEXOS AEV", minWidth: 300 },
    { id: "id_bancoaev", label: "ENVIAR A LA AEV", minWidth: 200 },
    { id: "iddesem_busa", label: "INSTRUCTIVO DESEMBOLSO BUSA", minWidth: 150 },
    { id: "multa", label: "MULTA", minWidth: 150 },
    { id: "descuento_anti_reten", label: "DESCUENTO ANTICIPO", minWidth: 150 },
    { id: "monto_fisico", label: "MONTO FISICO", minWidth: 150 },
    { id: "monto_desembolsado", label: "MONTO DESEMBOLSADO", minWidth: 150 },
    { id: "detalle", label: "TIPO PLANILLA", minWidth: 300 },
    { id: "fechabanco", label: "FECHA ENVIO AL BANCO", minWidth: 150 },
    { id: "fecha_generado", label: "FECHA INICIO PLANILLA", minWidth: 150 },
    { id: "fecha_abono", label: "FECHA DE ABONO", minWidth: 150 },
    { id: "numero_factura", label: "NUMERO DE FACTURA", minWidth: 150 },
    { id: "numero_inst", label: "OBSERVACIONES DE PAGO", minWidth: 50 },
    { id: "cuentatitular", label: "TITULAR", minWidth: 250 },
    { id: "iddesem", label: "ID", minWidth: 50 },
    // { id: "", label: "", minWidth: 50 }
  ];

  const rows = contcodComplejaData;

  const buscar = async (nombrePdfSeleccionado) => {
    try {
      const response = await axios.get(
        `${apiKey}/documentpdf/buscarpdf/${nombrePdfSeleccionado}`,
        { headers }
      );

      if (response.status === 200) {
        const responseData = response.data; // Debería ser un booleano
        setRespuestas(responseData); // Establece la respuesta booleana en el estado
      }
    } catch (error) {
      setErrorRespuestas(`RS: ${error.message}`);
    }
  };
  const verificarEnvioBanco = async (nombrepdf) => {
    try {
      const response = await axios.get(
        `${apiKey}/documentpdf/verificarenviobanco/${nombrepdf}`,
        { headers }
      );

      if (response.status === 200) {
        const responseData = JSON.parse(response.data); // Convierte la respuesta a booleano
        setVerificarenviobanco(responseData); // Retorna la respuesta booleana obtenida
      }
    } catch (error) {
      setErrorverificarbanco(`RS: ${error.message}`);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setRespuestas(null); // Puedes restablecer también el estado de respuestas si es necesario.
  };
  return (
    <>
      {errorcontcodComplejaData !== null && <h1>{errorcontcodComplejaData}</h1>}

      <VerificarInstr />
      <div className="flex min-h-full flex-col justify-center px-1 py-1 lg:px-4">
        <p className="text-c1p text-1xl font-bold">
          PROYECTO: {contcodComplejaData[0]?.objeto}
        </p>
        <br />
        <p className="text-c1p text-1xl font-bold">
          CODIGO: {contcodComplejaData[0]?.proy_cod}
        </p>
        <br />
      </div>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, textAlign: "center" }}
                    className={classes.tableCell}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {
              <TableBody>
                {rows.map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <>
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ textAlign: "center" }}
                              className={classes.tableCell}
                            >
                              {column.id === "multa" ||
                              column.id === "descuento_anti_reten" ||
                              column.id === "monto_fisico" ||
                              column.id === "monto_desembolsado" ? (
                                // formatearNumero(value)
                                formatearNumero(
                                  value !== null && value !== undefined
                                    ? value
                                    : 0
                                )
                              ) : column.id === "iddesem_aev" ? (
                                <>
                                  <h1
                                    className="text-center text-mi-color-primario"
                                    style={{ fontSize: "1rem" }}
                                  >
                                    <strong>{`${row.iddesem}-AEV`}</strong>
                                  </h1>
                                  <ButtonGroup
                                    variant="text"
                                    aria-label="text button group"
                                  >
                                    <Tooltip
                                      title="Subir PDF"
                                      placement="left-end"
                                    >
                                      <Button
                                        disabled={row.buttonAEV}
                                        color="error"
                                        size="small"
                                        component="span"
                                        endIcon={
                                          <UploadRoundedIcon size="large" />
                                        }
                                        onClick={() => {
                                          buscar(row.iddesem + "-AEV");
                                          setNombrePdfSeleccionado(
                                            row.iddesem + "-AEV"
                                          );
                                          setForceRender(
                                            (prevState) => !prevState
                                          );
                                          if (instructivoRef.current) {
                                            instructivoRef.current.scrollIntoView(
                                              {
                                                behavior: "smooth",
                                              }
                                            );
                                          }
                                        }}
                                      ></Button>
                                    </Tooltip>
                                    <SubirBajarEliminarPdf
                                      nombrepdf={row.iddesem + "-AEV"}
                                      buttonAEVBUSA={row.buttonAEV}
                                    />
                                  </ButtonGroup>
                                  <h2 className="text-center text-mi-color-primario"></h2>
                                  <div className="pb-2 flex  justify-center items-center">
                                    <AnexsosPdf
                                      nombrepdf={row.iddesem}
                                      buttonAEV={row.buttonAEV}
                                    />
                                  </div>
                                </>
                              ) : column.id === "id_aevbanco" ? (
                                <>
                                  <EnviarBanco
                                    nombrepdf={`${row.id}-AEV`}
                                    buttonAEVBUSA={row.buttonAEV}
                                  />
                                </>
                              ) : column.id === "id_bancoaev" ? (
                                <>
                                  <EnviarBanco
                                    nombrepdf={`${row.id}-BUSA`}
                                    buttonAEVBUSA={row.buttonBUSA}
                                  />
                                </>
                              ) : column.id === "iddesem_anexo" ? (
                                <>
                                  <BajarEliminarAnexos
                                    nombrepdf={row.iddesem}
                                    buttonAEV={row.buttonAEV}
                                  />
                                </>
                              ) : column.id === "iddesem_busa" ? (
                                <>
                                  <h1
                                    className="text-center text-blue-500"
                                    style={{ fontSize: "1rem" }}
                                  >
                                    <strong>{`${row.iddesem}-BUSA`}</strong>
                                  </h1>
                                  <ButtonGroup
                                    variant="text"
                                    aria-label="text button group"
                                  >
                                    <Tooltip
                                      title="Subir PDF"
                                      placement="left-end"
                                    >
                                      <Button
                                        disabled={row.buttonBUSA}
                                        color="error"
                                        size="small"
                                        component="span"
                                        endIcon={
                                          <UploadRoundedIcon size="large" />
                                        }
                                        onClick={() => {
                                          buscar(row.iddesem + "-BUSA");
                                          setNombrePdfSeleccionado(
                                            row.iddesem + "-BUSA"
                                          );
                                          setForceRender(
                                            (prevState) => !prevState
                                          );
                                          if (instructivoRef.current) {
                                            instructivoRef.current.scrollIntoView(
                                              {
                                                behavior: "smooth",
                                              }
                                            );
                                          }
                                        }}
                                      ></Button>
                                    </Tooltip>
                                    <SubirBajarEliminarPdf
                                      nombrepdf={row.iddesem + "-BUSA"}
                                      buttonAEVBUSA={row.buttonBUSA}
                                    />
                                  </ButtonGroup>
                                </>
                              ) : column.format && typeof value === "number" ? (
                                column.format(value)
                              ) : (
                                value
                              )}
                            </TableCell>
                          </>
                        );
                      })}
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell style={{ textAlign: "right" }}>
                    <strong className=" text-mi-color-secundario">
                      TOTAL{" "}
                    </strong>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <strong className=" text-mi-color-secundario">= </strong>
                    {contcodComplejaData.map((data) => {
                      totalMulta += data.multa;
                      totalDescuentoAntiReten += data.descuento_anti_reten;
                      totalMontoFisico += data.monto_fisico;
                      if (data.monto_desembolsado) {
                        totalMontoDesembolsado += data.monto_desembolsado;
                      }
                      return null;
                    })}
                    {formatearNumero(totalMulta)}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <strong className="text-mi-color-secundario">= </strong>
                    {formatearNumero(totalDescuentoAntiReten)}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <strong className="text-mi-color-secundario">= </strong>
                    {formatearNumero(totalMontoFisico)}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <strong className="text-mi-color-secundario">= </strong>
                    {formatearNumero(totalMontoDesembolsado)}
                  </TableCell>
                </TableRow>
              </TableBody>
            }
          </Table>
        </TableContainer>
      </Paper>
      <br />
      {respuestasError && <h1>{respuestasError}</h1>}
      {respuestas === false && nombrePdfSeleccionado && (
        <div ref={instructivoRef}>
          <Instructivo key={forceRender} nombrepdf={nombrePdfSeleccionado} />
        </div>
      )}
      {respuestas && (
        <Dialog
          open={open || respuestas}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            {respuestas && (
              <h1 className="text-center m-2 text-red-500">
                El archivo ya se subio al servidor puede eliminar, para subir un
                nuevo INSTRUCTIVO
              </h1>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
