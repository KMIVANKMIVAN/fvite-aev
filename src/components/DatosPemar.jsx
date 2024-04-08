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

import AddIcon from "@mui/icons-material/Add";

import { obtenerUserNivel } from "../utils/userdata";

// import Paper from "@material-ui/core/Paper";
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

import Typography from "@mui/material/Typography";

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

export function DatosPemar({
  selectedCodid,
  titulo,
  codigoProyecto,
  esVivienda,
  esPemar,
}) {
  console.log("entro a qui DatosPemar");

  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;
  const [contcodComplejaData, setContcodComplejaData] = useState([]);

  const [errorcontcodComplejaData, setErrorContcodComplejaData] = useState([]);

  const [nombrePdfSeleccionado, setNombrePdfSeleccionado] = useState(null);
  const [idDesembolso, setIdDesembolso] = useState(null);

  const [forceRender, setForceRender] = useState(false);

  const [respuestas, setRespuestas] = useState(null);
  const [respuestasError, setErrorRespuestas] = useState(null);

  const [mandarIDdesem, setMandarIDdesem] = useState(null);
  const [mostrarAnexos, setMostrarAnexos] = useState(false);

  const [open, setOpen] = useState(false);

  const instructivoRef = useRef(null);

  const classes = useStyles();

  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchData = async () => {
      if (selectedCodid) {
        try {
          const url = `${apiKey}/cuadro/consultasipago/${selectedCodid}`;

          const response = await axios.get(url, { headers });

          if (response.status === 200) {
            setErrorContcodComplejaData(null);
            setContcodComplejaData(response.data);
          }
        } catch (error) {
          if (error.response) {
            const { status, data } = error.response;
            if (status === 400) {
              setErrorContcodComplejaData(`RS: ${data.message}`);
            } else if (status === 500) {
              setErrorContcodComplejaData(`RS: ${data.message}`);
            }
          } else if (error.request) {
            setErrorContcodComplejaData(
              "RF: No se pudo obtener respuesta del servidor"
            );
          } else {
            setErrorContcodComplejaData("RF: Error al enviar la solicitud");
          }
        }
      }
    };

    fetchData();
  }, [selectedCodid]);

  if (contcodComplejaData.length === 0 || selectedCodid === 0) {
    return null;
  }

  let totalMulta = 0;
  let totalMontoDesembolsado = 0;

  const columns = [
    // { id: "id_aevbanco", label: "ENVIAR AL BANCO", minWidth: 200 },
    { id: "mandarAnexInstr", label: "PROCESAR", minWidth: 200 },
    // { id: "id_aev", label: "INSTRUCTIVO DESEMBOLSO AEV", minWidth: 150 },
    // { id: "id_anexo", label: "ANEXOS AEV", minWidth: 300 },
    // { id: "id_bancoaev", label: "ENVIAR A LA AEV", minWidth: 200 },
    // { id: "id_busa", label: "INSTRUCTIVO DESEMBOLSO BUSA", minWidth: 150 },
    { id: "multa", label: "MULTA", minWidth: 150 },
    { id: "monto_desembolsado", label: "DESEMBOLSADO Bs.", minWidth: 150 },
    { id: "detalle", label: "TIPO", minWidth: 300 },
    { id: "objeto", label: "OBJETO", minWidth: 650 },
    { id: "fecha_banco", label: "FECHA EMISION", minWidth: 150 },
    { id: "numero_factura", label: "Nro FACTURA", minWidth: 150 },
    { id: "numero_inst", label: "Nro VALORADO", minWidth: 150 },
    { id: "fechagenerado", label: "FECHA BANCO", minWidth: 150 },
    { id: "etapa", label: "VoBo", minWidth: 150 },
    { id: "fecha_abono", label: "ABONO EN CUENTA", minWidth: 150 },
    { id: "observacion", label: "OBSERVACIONES", minWidth: 200 },
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
      {errorcontcodComplejaData && (
        <p className="text-red-700 text-center p-5">
          {errorcontcodComplejaData}
        </p>
      )}
      {/* <VerificarInstr /> */}
      {/* hola{codigoProyecto} */}
      {/* hola{selectedCodid} */}
      <Typography className="p-3 text-c600 text-2xl" variant="h5" gutterBottom>
        INSTRUCTIVOS:
      </Typography>
      <div className="flex min-h-full flex-col justify-center px-1 py-1 lg:px-4">
        {/* <Typography className="text-c1p" variant="subtitle2" gutterBottom>
          PROYECTO: {titulo}
        </Typography>
        <Typography className="text-c1p" variant="subtitle2" gutterBottom>
          CODIGO: {contcodComplejaData[0]?.proy_cod}
        </Typography> */}
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
                                {column.id === "monto_desembolsado" ||
                                column.id === "multa" ? (
                                  (formatearNumero(
                                    value !== null && value !== undefined
                                      ? value
                                      : 0
                                  ) /*: column.id === "id_aev" ? (
                                  <>
                                    <Typography
                                      className="text-center text-c500"
                                      variant="button"
                                      display="block"
                                      gutterBottom
                                    >
                                      {`${row.id}-AEV`}
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
                                            buscar(row.id + "-AEV");
                                            setIdDesembolso(row.id);
                                            setNombrePdfSeleccionado(
                                              row.id + "-AEV"
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
                                        nombrepdf={row.id + "-AEV"}
                                        buttonAEVBUSA={
                                          row.buttonAEV === "1" ||
                                          obtenerUserNivel() === 40
                                        }
                                        nomCarperta={row.id}
                                      />
                                    </ButtonGroup>
                                    <h2 className="text-center text-c500"></h2>
                                    <div className="pb-2 flex  justify-center items-center">
                                      <AnexsosPdf
                                        nombrepdf={row.id}
                                        buttonAEV={
                                          row.buttonAEV === "1" ||
                                          obtenerUserNivel() === 40
                                        }
                                        nomCarperta={row.id}
                                      />
                                    </div>
                                  </>
                                ) : column.id === "id_anexo" ? (
                                  <>
                                    <BajarEliminarAnexos
                                      nombrepdf={row.id}
                                      buttonAEV={
                                        row.buttonAEV === "1" ||
                                        obtenerUserNivel() === 40
                                      }
                                      nomCarperta={row.id}
                                    />
                                  </>
                                ) */)
                                ) : /* ) : column.id === "id_aevbanco" ? (
                                  <>
                                    <EnviarBanco
                                      nombrepdf={`${row.id}-AEV`}
                                      buttonAEVBUSA={
                                        row.buttonAEV === "1" ||
                                        obtenerUserNivel() === 40
                                      }
                                      nomCarperta={row.id}
                                    />
                                  </>
                                ) */
                                column.id === "mandarAnexInstr" ? (
                                  (<>
                                    <Button
                                      onClick={() => {
                                        setMandarIDdesem(row.id);
                                        setIdDesembolso(row.id)
                                        setMostrarAnexos(true);
                                      }}
                                      variant="outlined"
                                      size="small"
                                    >
                                      {/* PROCESAR: {`${row.id}-AEV`} */}
                                      PROCESAR: {row.id}
                                    </Button>
                                  </> /* : column.id === "id_bancoaev" ? (
                                  <>
                                    <EnviarBanco
                                      nombrepdf={`${row.id}-BUSA`}
                                      buttonAEVBUSA={
                                        row.buttonBUSA === "1" ||
                                        obtenerUserNivel() === 9
                                      }
                                      nomCarperta={row.id}
                                    />
                                  </>
                                ) : column.id === "id_busa" ? (
                                  <>
                                    <Typography
                                      className="text-center text-c700"
                                      variant="button"
                                      display="block"
                                      gutterBottom
                                    >
                                      {`${row.id}-BUSA`}
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
                                            buscar(row.id + "-BUSA");
                                            setIdDesembolso(row.id);
                                            setNombrePdfSeleccionado(
                                              row.id + "-BUSA"
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
                                        nombrepdf={row.id + "-BUSA"}
                                        buttonAEVBUSA={
                                          row.buttonBUSA === "1" ||
                                          obtenerUserNivel() === 9
                                        }
                                        nomCarperta={row.id}
                                      />
                                    </ButtonGroup>
                                  </>
                                ) */ /*: column.id === "id_bancoaev" ? (
                                  <>
                                    <EnviarBanco
                                      nombrepdf={`${row.id}-BUSA`}
                                      buttonAEVBUSA={
                                        row.buttonBUSA === "1" ||
                                        obtenerUserNivel() === 9
                                      }
                                      nomCarperta={row.id}
                                    />
                                  </>
                                ) : column.id === "id_busa" ? (
                                  <>
                                    <Typography
                                      className="text-center text-c700"
                                      variant="button"
                                      display="block"
                                      gutterBottom
                                    >
                                      {`${row.id}-BUSA`}
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
                                            buscar(row.id + "-BUSA");
                                            setIdDesembolso(row.id);
                                            setNombrePdfSeleccionado(
                                              row.id + "-BUSA"
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
                                        nombrepdf={row.id + "-BUSA"}
                                        buttonAEVBUSA={
                                          row.buttonBUSA === "1" ||
                                          obtenerUserNivel() === 9
                                        }
                                        nomCarperta={row.id}
                                      />
                                    </ButtonGroup>
                                  </>
                                ) */ /*: column.id === "id_bancoaev" ? (
                                  <>
                                    <EnviarBanco
                                      nombrepdf={`${row.id}-BUSA`}
                                      buttonAEVBUSA={
                                        row.buttonBUSA === "1" ||
                                        obtenerUserNivel() === 9
                                      }
                                      nomCarperta={row.id}
                                    />
                                  </>
                                ) : column.id === "id_busa" ? (
                                  <>
                                    <Typography
                                      className="text-center text-c700"
                                      variant="button"
                                      display="block"
                                      gutterBottom
                                    >
                                      {`${row.id}-BUSA`}
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
                                            buscar(row.id + "-BUSA");
                                            setIdDesembolso(row.id);
                                            setNombrePdfSeleccionado(
                                              row.id + "-BUSA"
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
                                        nombrepdf={row.id + "-BUSA"}
                                        buttonAEVBUSA={
                                          row.buttonBUSA === "1" ||
                                          obtenerUserNivel() === 9
                                        }
                                        nomCarperta={row.id}
                                      />
                                    </ButtonGroup>
                                  </>
                                ) */)
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
                    {/* <TableCell></TableCell> */}
                    {/* <TableCell></TableCell> */}
                    {/* <TableCell></TableCell> */}
                    {/* <TableCell></TableCell> */}
                    <TableCell style={{ textAlign: "right" }}>
                      <strong className="text-c500">TOTAL </strong>
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      <strong className=" text-c500">= </strong>
                      {contcodComplejaData.map((data) => {
                        totalMulta += data.multa;
                        if (data.monto_desembolsado) {
                          totalMontoDesembolsado += data.monto_desembolsado;
                        }
                        return null;
                      })}
                      {formatearNumero(totalMulta)}
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
              key={forceRender}
              nombrepdf={nombrePdfSeleccionado}
              codigoProyecto={codigoProyecto}
              idDesembolso={idDesembolso}
              selectVContCodPCodid={selectedCodid}
              esVivienda={esVivienda}
              esPemar={esPemar}
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
      {mostrarAnexos && (
        <AnexsosPdf
          nombrepdf={mandarIDdesem}
          codigoProyecto={codigoProyecto}
          idDesembolso={idDesembolso}
          selectVContCodPCodid={selectedCodid}
          esVivienda={esVivienda}
          esPemar={esPemar}
        />
      )}
      {/* <AnexsosPdf nombrepdf={mandarIDdesem} /> */}
    </>
  );
}
