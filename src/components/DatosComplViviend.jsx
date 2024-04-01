import React, { useState, useEffect, useRef } from "react";

import axios from "axios";
import { obtenerToken } from "../utils/auth";

import { BajarEliminarAnexos } from "./BajarEliminarAnexos";

import { SubirBajarEliminarPdf } from "./SubirBajarEliminarPdf";
import { AnexsosPdf } from "./AnexsosPdf";

// import { makeStyles } from "@material-ui/core/styles";
import { makeStyles } from "@mui/styles";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";

import { EnviarBanco } from "./EnviarBanco";

import { Instructivo } from "./Instructivo";
import { VerificarInstr } from "./VerificarInstr";

import Typography from "@mui/material/Typography";

import { obtenerUserNivel } from "../utils/userdata";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  root: {
    width: "100%",
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

export function DatosComplViviend({ selectedContCod, codigoProyecto }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const [contcodComplejaData, setContcodComplejaData] = useState([]);

  const [nombrePdfSeleccionado, setNombrePdfSeleccionado] = useState(null);
  const [idDesembolso, setIdDesembolso] = useState(null);

  const [forceRender, setForceRender] = useState(false);

  const [respuestas, setRespuestas] = useState(null);
  const [respuestasError, setErrorRespuestas] = useState(null);

  const [errorData, setErrorData] = useState(null);

  const [open, setOpen] = useState(false);

  const instructivoRef = useRef(null);

  // const habilitarDeshabilitar

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
            setErrorData(null);
            setContcodComplejaData(response.data);
          }
        } catch (error) {
          if (error.response) {
            const { status, data } = error.response;
            if (status === 400) {
              setErrorData(`RS: ${data.message}`);
            } else if (status === 500) {
              setErrorData(`RS: ${data.message}`);
            }
          } else if (error.request) {
            setErrorData("RF: No se pudo obtener respuesta del servidor");
          } else {
            setErrorData("RF: Error al enviar la solicitud");
          }
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
  ];

  const rows = contcodComplejaData;

  const buscar = async (nombrePdfSeleccionado) => {
    try {
      const response = await axios.get(
        `${apiKey}/documentpdf/buscarpdf/${nombrePdfSeleccionado}`,
        { headers }
      );
      if (response.status === 200) {
        setErrorRespuestas(null);
        setRespuestas(response.data);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setErrorRespuestas(`RS: ${data.message}`);
        } else if (status === 500) {
          setErrorRespuestas(`RS: ${data.message}`);
        }
      } else if (error.request) {
        setErrorRespuestas("RF: No se pudo obtener respuesta del servidor");
      } else {
        setErrorRespuestas("RF: Error al enviar la solicitud");
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setRespuestas(null);
  };

  return (
    <>
      {errorData && <p className="text-red-700 text-center p-5">{errorData}</p>}
      <VerificarInstr />
      <div className="flex min-h-full flex-col justify-center px-1 py-1 lg:px-4">
        <Typography className="text-c1p" variant="subtitle2" gutterBottom>
          PROYECTO: {contcodComplejaData[0]?.objeto}
        </Typography>
        <Typography className="text-c1p" variant="subtitle2" gutterBottom>
          CODIGO: {contcodComplejaData[0]?.proy_cod}
        </Typography>
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
                                  formatearNumero(
                                    value !== null && value !== undefined
                                      ? value
                                      : 0
                                  )
                                ) : column.id === "iddesem_aev" ? (
                                  <>
                                    <Typography
                                      className="text-center text-c500"
                                      variant="button"
                                      display="block"
                                      gutterBottom
                                    >
                                      {`${row.iddesem}-AEV`}
                                    </Typography>
                                    <ButtonGroup
                                      variant="text"
                                      aria-label="text button group"
                                    >
                                      <Tooltip
                                        title="Subir PDF"
                                        placement="left-end"
                                      >
                                        <Button
                                          /*  disabled={
                                            desabilitarAEVBUSA
                                              ? true
                                              : desabilitarBUSA
                                              ? true
                                              : row.buttonAEV === 1
                                              ? true
                                              : false
                                          } */
                                          // disabled={obtenerUserNivel() === 40}
                                          /* disabled={
                                            row.buttonAEV === "1"
                                              ? true
                                              : obtenerUserNivel() === 40
                                              ? true
                                              : false
                                          } */
                                          disabled={
                                            row.buttonAEV === "1" ||
                                            obtenerUserNivel() === 40
                                          }
                                          color="error"
                                          size="small"
                                          component="span"
                                          endIcon={
                                            <UploadRoundedIcon size="large" />
                                          }
                                          onClick={() => {
                                            buscar(row.iddesem + "-AEV");
                                            setIdDesembolso(row.iddesem);
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
                                        nomCarperta={row.iddesem}
                                        // nomCarAnt={row.iddesem}
                                        /* buttonAEVBUSA={
                                          row.buttonAEV === 1 ? true : false
                                        } */
                                        buttonAEVBUSA={
                                          // obtenerUserNivel() === 40

                                          row.buttonAEV === "1" ||
                                          obtenerUserNivel() === 40
                                        }
                                      />
                                    </ButtonGroup>
                                    <h2 className="text-center text-c500"></h2>
                                    <div className="pb-2 flex  justify-center items-center">
                                      <AnexsosPdf
                                        nombrepdf={row.iddesem}
                                        /* buttonAEV={
                                          desabilitarAEVBUSA
                                            ? true
                                            : desabilitarBUSA
                                            ? true
                                            : row.buttonAEV === 1
                                            ? true
                                            : false
                                        } */
                                        // buttonAEV={obtenerUserNivel() === 40}
                                        buttonAEV={
                                          row.buttonAEV === "1" ||
                                          obtenerUserNivel() === 40
                                        }
                                      />
                                    </div>
                                  </>
                                ) : column.id === "id_aevbanco" ? (
                                  <>
                                    <EnviarBanco
                                      nombrepdf={`${row.iddesem}-AEV`}
                                      /* buttonAEVBUSA={
                                        desabilitarAEVBUSA
                                          ? true
                                          : desabilitarBUSA
                                          ? true
                                          : row.buttonAEV === 1
                                          ? true
                                          : false
                                      } */
                                      // buttonAEVBUSA={obtenerUserNivel() === 40}
                                      buttonAEVBUSA={
                                        row.buttonAEV === "1" ||
                                        obtenerUserNivel() === 40
                                      }
                                    />
                                  </>
                                ) : column.id === "id_bancoaev" ? (
                                  <>
                                    <EnviarBanco
                                      nombrepdf={`${row.iddesem}-BUSA`}
                                      /* buttonAEVBUSA={
                                        desabilitarAEVBUSA
                                          ? true
                                          : desabilitarAEV
                                          ? true
                                          : row.buttonBUSA === 1
                                          ? true
                                          : false
                                      } */
                                      // buttonAEVBUSA={obtenerUserNivel() === 9}
                                      buttonAEVBUSA={
                                        row.buttonBUSA === "1" ||
                                        obtenerUserNivel() === 9
                                      }
                                    />
                                  </>
                                ) : column.id === "iddesem_anexo" ? (
                                  <>
                                    <BajarEliminarAnexos
                                      nombrepdf={row.iddesem}
                                      /* buttonAEV={
                                        desabilitarAEVBUSA
                                          ? true
                                          : desabilitarBUSA
                                          ? true
                                          : row.buttonAEV === 1
                                          ? true
                                          : false
                                      } */
                                      // buttonAEV={obtenerUserNivel() === 40}
                                      buttonAEV={
                                        row.buttonAEV === "1" ||
                                        obtenerUserNivel() === 40
                                      }
                                    />
                                  </>
                                ) : column.id === "iddesem_busa" ? (
                                  <>
                                    <Typography
                                      className="text-center text-c700"
                                      variant="button"
                                      display="block"
                                      gutterBottom
                                    >
                                      {`${row.iddesem}-BUSA`}
                                    </Typography>
                                    <ButtonGroup
                                      variant="text"
                                      aria-label="text button group"
                                    >
                                      <Tooltip
                                        title="Subir PDF"
                                        placement="left-end"
                                      >
                                        <Button
                                          /* disabled={
                                            desabilitarAEVBUSA
                                              ? true
                                              : desabilitarAEV
                                              ? true
                                              : row.buttonBUSA === 1
                                              ? true
                                              : false
                                          } */
                                          // disabled={obtenerUserNivel() === 9}
                                          disabled={
                                            row.buttonBUSA === "1" ||
                                            obtenerUserNivel() === 9
                                          }
                                          color="error"
                                          size="small"
                                          component="span"
                                          endIcon={
                                            <UploadRoundedIcon size="large" />
                                          }
                                          onClick={() => {
                                            buscar(row.iddesem + "-BUSA");
                                            setIdDesembolso(row.iddesem);
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
                                        /* buttonAEVBUSA={
                                          desabilitarAEVBUSA
                                            ? true
                                            : desabilitarAEV
                                            ? true
                                            : row.buttonBUSA === 1
                                            ? true
                                            : false
                                        } */
                                        buttonAEVBUSA={
                                          row.buttonBUSA === "1" ||
                                          obtenerUserNivel() === 9
                                        }
                                      />
                                    </ButtonGroup>
                                  </>
                                ) : column.format &&
                                  typeof value === "number" ? (
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
                      <strong className=" text-c500">TOTAL </strong>
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      <strong className=" text-c500">= </strong>
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
                      <strong className="text-c500">= </strong>
                      {formatearNumero(totalDescuentoAntiReten)}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      <strong className="text-c500">= </strong>
                      {formatearNumero(totalMontoFisico)}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      <strong className="text-c500">= </strong>
                      {formatearNumero(totalMontoDesembolsado)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              }
            </Table>
          </TableContainer>
        </Paper>
        <br />
        {respuestasError && (
          <p className="text-red-700 text-center p-5">{respuestasError}</p>
        )}
        {respuestas === false && nombrePdfSeleccionado && (
          <div ref={instructivoRef}>
            <Instructivo
              codigoProyecto={codigoProyecto}
              key={forceRender}
              idDesembolso={idDesembolso}
              nombrepdf={nombrePdfSeleccionado}
            />
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
                  El archivo ya se subio al servidor puede eliminar, para subir
                  un nuevo INSTRUCTIVO
                </h1>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cerrar</Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </>
  );
}
