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

export function DatosComplViviend({
  selectedContCod,
  codigoProyecto,
  esVivienda,
  esPemar,
}) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const [contcodComplejaData, setContcodComplejaData] = useState([]);

  const [idDesembolso, setIdDesembolso] = useState(null);

  const [errorData, setErrorData] = useState(null);

  const [mandarIDdesem, setMandarIDdesem] = useState(null);
  const [mostrarAnexos, setMostrarAnexos] = useState(false);

  const [pdfKey, setPdfKey] = useState(0);

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
    { id: "mandarAnexInstr", label: "ESTADO", minWidth: 200 },
    { id: "cite", label: "CITE", minWidth: 200 },
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

  return (
    <>
      <div
        className="ml-1 rounded-tl-lg rounded-br-lg"
        style={{ borderLeft: "10px solid #168AAD" }}
      >
        {errorData && (
          <p className="text-red-700 text-center p-5">{errorData}</p>
        )}
        <Typography
          className="p-3 text-c600 text-2xl"
          variant="h5"
          gutterBottom
        >
          INSTRUCTIVOS:
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
                    let rowColor = ""; // Variable para almacenar el color de la fila
                    let rowText = ""; // Variable para almacenar el texto de la fila
                    if (row.fecha_banco && row.fecha_busa) {
                      rowColor = "#2ECC71"; // Color verde si ambas fechas están presentes
                      rowText = "Completado";
                    } else if (!row.fecha_busa) {
                      rowColor = "#EC7063"; // Color amarillo si fecha_busa está ausente
                      rowText = "Por Procesar";
                    }
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
                                ) : column.id === "mandarAnexInstr" ? (
                                  <>
                                    <Button
                                      onClick={() => {
                                        setMandarIDdesem(row.iddesem);
                                        setIdDesembolso(row.iddesem);
                                        setMostrarAnexos(true);
                                        setPdfKey((prevKey) => prevKey + 1);
                                      }}
                                      variant="outlined"
                                      size="small"
                                      style={{
                                        backgroundColor: rowColor,
                                        color: "white",
                                      }}
                                    >
                                      {/* PROCESAR: {`${row.id}-AEV`} */}
                                      {/* PROCESAR: {row.iddesem} */}
                                      {rowText}
                                    </Button>
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
        {mostrarAnexos && (
          <>
            <AnexsosPdf
              key={pdfKey}
              nombrepdf={mandarIDdesem}
              codigoProyecto={codigoProyecto}
              idDesembolso={idDesembolso}
              selectVContCodPCodid={selectedContCod}
              esVivienda={esVivienda}
              esPemar={esPemar}
            />
          </>
        )}
      </div>
    </>
  );
}
