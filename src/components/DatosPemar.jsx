import React, { useState, useEffect, useRef } from "react";

import { useSelector, useDispatch } from "react-redux";

import axios from "axios";
import { obtenerToken } from "../utils/auth";

import { AnexsosPdf } from "./AnexsosPdf";

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

const formatearFecha = (fecha) => {
  const fechaObj = new Date(fecha);
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  return fechaObj.toLocaleDateString("es-ES", options);
};

export function DatosPemar({
  selectedCodid,
  titulo,
  codigoProyecto,
  esVivienda,
  esPemar,
}) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const [reloadComponent, setReloadComponent] = useState(false);

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

  const prevUpdateComponent = useRef(null);
  const updateComponent = useSelector((state) => state.pemar.updateComponent);

  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  /* useEffect(() => {
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
  }, [selectedCodid, updateComponent]); */

  useEffect(() => {
    const fetchData = async () => {
      if (selectedCodid && updateComponent !== prevUpdateComponent.current) {
        prevUpdateComponent.current = updateComponent; // Actualizar el valor previo

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
            if (status === 400 || status === 500) {
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
  }, [selectedCodid, updateComponent]);

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
    {
      id: "fecha_banco",
      label: "FECHA EMISION",
      minWidth: 150,
      format: (value) => formatearFecha(value),
    },
    { id: "numero_factura", label: "Nro FACTURA", minWidth: 150 },
    { id: "numero_inst", label: "Nro VALORADO", minWidth: 150 },
    {
      id: "fechagenerado",
      label: "FECHA BANCO",
      minWidth: 150,
      // format: (value) => formatearFecha(value),
    },
    { id: "etapa", label: "VoBo", minWidth: 150 },
    { id: "fecha_abono", label: "ABONO EN CUENTA", minWidth: 150 },
    { id: "observacion", label: "OBSERVACIONES", minWidth: 200 },
  ];

  // const rows = contcodComplejaData;
  const rows = contcodComplejaData.map((row) => ({
    ...row,
    fecha_banco: formatearFecha(row.fecha_banco), // Formatear la fecha para cada fila
    // fechagenerado: formatearFecha(row.fechagenerado), // Formatear la fecha para cada fila
  }));

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
      <Typography className="p-3 text-c600 text-2xl" variant="h5" gutterBottom>
        INSTRUCTIVOS:
      </Typography>
      {/* <div className="flex min-h-full flex-col justify-center px-1 py-1 lg:px-4"> */}
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <>
                    {/* <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, textAlign: "center" }}
                      className={classes.tableCell}
                    >
                      {column.label}
                    </TableCell> */}
                    <StyledTableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        textAlign: "center",
                      }}
                      className={classes.tableCell}
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
                                formatearNumero(
                                  value !== null && value !== undefined
                                    ? value
                                    : 0
                                )
                              ) : column.id === "mandarAnexInstr" ? (
                                <>
                                  <Button
                                    onClick={() => {
                                      setMandarIDdesem(row.id);
                                      setIdDesembolso(row.id);
                                      setMostrarAnexos(true);
                                    }}
                                    variant="outlined"
                                    size="small"
                                  >
                                    PROCESAR: {row.id}
                                  </Button>
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
      {/* </div> */}
      {mostrarAnexos && (
        <>
          <AnexsosPdf
            // key={updateComponent}
            nombrepdf={mandarIDdesem}
            codigoProyecto={codigoProyecto}
            idDesembolso={idDesembolso}
            selectVContCodPCodid={selectedCodid}
            esVivienda={esVivienda}
            esPemar={esPemar}
          />
        </>
      )}
      {/* <AnexsosPdf nombrepdf={mandarIDdesem} /> */}
    </>
  );
}
