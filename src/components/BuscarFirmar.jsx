import { useState, useEffect } from "react";

import axios from "axios";
import { obtenerToken } from "../utils/auth";

import { DatosComplViviend } from "./DatosComplViviend";
import { DatosPemar } from "./DatosPemar";

import { makeStyles } from "@mui/styles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";

import Typography from "@mui/material/Typography";

import StyledTableCell from "./stilostablas/EtilosTable";

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

const formatearFecha = (fecha) => {
  const fechaObj = new Date(fecha);
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  return fechaObj.toLocaleDateString("es-ES", options);
};

const columns = [
  { id: "mandarAnexInstr", label: "ESTADO", minWidth: 200 },
  { id: "cite", label: "CITE", minWidth: 200 },
  {
    id: "fecha_banco",
    label: "FECHA EMISION",
    minWidth: 150,
    format: (value) => formatearFecha(value),
  },
];

export function BuscarFirmar() {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const [datostrinsbu, setDatostrinsbu] = useState([]);
  const [errorDatostrinsbu, setErrorDatostrinsbu] = useState(null);

  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const datosparabusa = async () => {
      try {
        const urlTipoRespaldo = `${apiKey}/cuadro/trinsbu`;
        const response = await axios.get(urlTipoRespaldo, { headers });
        if (response.status === 200) {
          setErrorDatostrinsbu(null); // Corrige esto, reemplazando setErrorDatosBusa por setErrorDatostrinsbu
          setDatostrinsbu(response.data);
        }
      } catch (error) {
        setDatostrinsbu([]);
        if (error.response) {
          const { status, data } = error.response;
          if (status === 400) {
            setErrorDatostrinsbu(`RS: ${data.message}`);
          } else if (status === 500) {
            setErrorDatostrinsbu(`RS: ${data.message}`);
          }
        } else if (error.request) {
          setErrorDatostrinsbu("RF: No se pudo obtener respuesta del servidor");
        } else {
          setErrorDatostrinsbu("RF: Error al enviar la solicitud");
        }
      }
    };

    datosparabusa();
  }, []);

  let totalMulta = 0;
  let totalMontoDesembolsado = 0;

  // const rows = contcodComplejaData;
  const rows = datostrinsbu.map((row) => ({
    ...row,
    fecha_banco: formatearFecha(row.fecha_banco), // Formatear la fecha para cada fila
    // fechagenerado: formatearFecha(row.fechagenerado), // Formatear la fecha para cada fila
  }));

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-1 py-1 lg:px-4">
        {errorDatostrinsbu && (
          <p className="text-red-700 text-center p-5">{errorDatostrinsbu}</p>
        )}
        <Typography
          className="p-3 text-c600 text-2xl"
          variant="h5"
          gutterBottom
        >
          INSTRUCTIVOS:
        </Typography>
        <Paper>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <>
                      <StyledTableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          textAlign: "center",
                        }}
                        // className={classes.tableCell}
                      >
                        {column.label}
                      </StyledTableCell>
                    </>
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
                                // className={classes.tableCell}
                              >
                                {column.id === "monto_desembolsado" ||
                                column.id === "multa" ? (
                                  formatearNumero(
                                    value !== null && value !== undefined
                                      ? value
                                      : 0
                                  )
                                ) : column.id === "mandarAnexInstr" ? (
                                  <>
                                    {/* a{rowText} */}
                                    <Button
                                      onClick={() => {
                                        setMandarIDdesem(row.id);
                                        setIdDesembolso(row.id);
                                        setMostrarAnexos(true);
                                        setProyecMostrarCod(row.cite);
                                        setPdfKey((prevKey) => prevKey + 1);
                                      }}
                                      variant="outlined"
                                      size="small"
                                      style={{
                                        backgroundColor: rowColor,
                                        color: "white",
                                      }}
                                    >
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
                  {/* <TableRow>
                    <TableCell></TableCell>
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
                  </TableRow> */}
                </TableBody>
              }
            </Table>
          </TableContainer>
        </Paper>
        {/* {mostrarAnexos && (
          <>
            <AnexsosPdf
              key={pdfKey}
              nombrepdf={mandarIDdesem}
              codigoProyecto={codigoProyecto}
              idDesembolso={idDesembolso}
              selectVContCodPCodid={selectedCodid}
              esVivienda={esVivienda}
              esPemar={esPemar}
              proyecMostrarCod={proyecMostrarCod}
            />
          </>
        )} */}
      </div>
      {/* {tipoPemar && (
        <DatosPemar
          codigoProyecto={codigoProyecto}
          key={updateComponent}
          selectedCodid={selectedCodid}
          titulo={titulo}
          desabilitarBUSA={desabilitarBUSA}
        />
      )}
      {tipoVivien && (
        <DatosComplViviend
          codigoProyecto={codigoProyecto}
          key={updateComponent}
          selectedContCod={selectedContCod}
          desabilitarBUSA={desabilitarBUSA}
        />
      )} */}
      <br />
    </>
  );
}
