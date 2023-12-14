import { useState, useEffect } from "react";

import axios from "axios";
import { obtenerToken } from "../utils/auth";

import { BajarEliminarAnexos } from "./BajarEliminarAnexos";

import { SubirBajarEliminarPdf } from "./SubirBajarEliminarPdf";
import { AnexsosPdf } from "./AnexsosPdf";

import { makeStyles } from "@material-ui/core/styles";

import { Jacobitus } from "./Jacobitus";

import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

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

export function DatosComplViviend({ selectedContCod }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const count = useSelector((state) => state.counter.value);

  const [contcodComplejaData, setContcodComplejaData] = useState([]);

  const [errorcontcodComplejaData, setErrorContcodComplejaData] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      if (selectedContCod) {
        try {
          const token = obtenerToken();
          const headers = {
            Authorization: `Bearer ${token}`,
          };

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
    { id: "iddesem_aev", label: "INSTR. DESEN. AEV", minWidth: 50 },
    { id: "iddesem_anexo", label: "ANEXOS AEV", minWidth: 300 },
    { id: "iddesem_busa", label: "INSTR. DESEN. BUSA", minWidth: 50 },
    { id: "multa", label: "MULTA", minWidth: 150 },
    { id: "descuento_anti_reten", label: "DESCUENTO ANTICIPO", minWidth: 150 },
    { id: "monto_fisico", label: "MONTO FISICO", minWidth: 150 },
    { id: "monto_desembolsado", label: "MONTO DESEMBOLSADO", minWidth: 150 },
    { id: "detalle", label: "TIPO PLANILLA", minWidth: 300 },
    { id: "iddesem", label: "ID", minWidth: 50 },
    { id: "fechabanco", label: "FECHA ENVIO AL BANCO", minWidth: 50 },
    { id: "fecha_generado", label: "FECHA INICIO PLANILLA", minWidth: 50 },
    { id: "fecha_abono", label: "FECHA DE ABONO", minWidth: 50 },
    { id: "numero_factura", label: "NUMERO DE FACTURA", minWidth: 50 },
    { id: "numero_inst", label: "OBSERVACIONES DE PAGO", minWidth: 50 },
    { id: "cuentatitular", label: "TITULAR", minWidth: 50 },
    // { id: "", label: "", minWidth: 50 }
  ];

  const rows = contcodComplejaData;

  return (
    <>
      {errorcontcodComplejaData !== null && <h1>{errorcontcodComplejaData}</h1>}
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
                                  <h2 className="text-center  text-mi-color-primario">
                                    {" "}
                                    <strong>INSTR. DESEN. AEV</strong>
                                  </h2>
                                  <SubirBajarEliminarPdf
                                    nombrepdf={row.iddesem + "-AEV"}
                                  />
                                  <h2 className="text-center text-mi-color-primario">
                                    {" "}
                                    <strong>ANEXOS AEV</strong>
                                  </h2>
                                  <div className="pb-2 flex  justify-center items-center">
                                    <AnexsosPdf nombrepdf={row.iddesem} />
                                  </div>
                                </>
                              ) : column.id === "iddesem_anexo" ? (
                                <>
                                  <BajarEliminarAnexos
                                    nombrepdf={row.iddesem}
                                  />
                                </>
                              ) : column.id === "iddesem_busa" ? (
                                <>
                                  <h2 className="text-center text-blue-500">
                                    <strong>INSTR. DESEN. BUSA</strong>
                                  </h2>
                                  <SubirBajarEliminarPdf
                                    nombrepdf={row.iddesem + "-BUSA"}
                                  />
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
      <Jacobitus />
    </>
  );
}
