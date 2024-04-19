import React, { useState, useEffect } from "react";
import axios from "axios";
import { obtenerToken } from "../utils/auth";

import { obtenerUserId, obtenerFirmadorUserId } from "../utils/userdata";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";

import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

import StyledTableCell from "./stilostablas/EtilosTable";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

import { useDispatch, useSelector } from "react-redux";
import { increment } from "../contexts/features/counter/counterSlice";

import { Instructivo } from "./Instructivo";

const formatearFecha = (fecha) => {
  const fechaObj = new Date(fecha);
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return fechaObj.toLocaleDateString("es-ES", options);
};

export function BajarEliminarAnexos({
  nombrepdf,
  buttonAEV,
  codigoProyecto,
  idDesembolso,
  selectVContCodPCodid,
  esPemar,
  esVivienda,
  proyecMostrarCod,
}) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  // const dispatch = useDispatch();
  // const count = useSelector((state) => state.counter.value);

  const [abrirErrorDescarga, setAbrirErrorDescarga] = useState(false);
  const [abrirEliminar, setAbrirEliminar] = useState(false);

  const [respuestaFindallone, setRespuestaFindallone] = useState([]);
  const [errorRespuestaFindallone, setErrorRespuestaFindallone] =
    useState(null);

  const [respuestaDescargar, setRespuestaDescargar] = useState(null);
  const [respuestaEliminar, setRespuestaEliminar] = useState(null);
  const [ErrorEliminar, setErrorEliminar] = useState(null);

  const [reloadEliminar, setReloadEliminar] = useState(false); // Estado para controlar la recarga

  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const obtenerDatosFindAllOne = async () => {
      try {
        const url = `${apiKey}/respaldodesembolsos/findallone/${nombrepdf}`;

        const response = await axios.get(url, { headers });

        if (response.status === 200) {
          setErrorRespuestaFindallone(null);
          setRespuestaFindallone(response.data);
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 400) {
            setErrorRespuestaFindallone(`RS: ${data.error}`);
          } else if (status === 500) {
            setErrorRespuestaFindallone(`RS: ${data.message}`);
          }
        } else if (error.request) {
          setErrorRespuestaFindallone(
            "RF: No se pudo obtener respuesta del servidor"
          );
        } else {
          setErrorRespuestaFindallone("RF: Error al enviar la solicitud");
        }
      }
    };
    obtenerDatosFindAllOne();
  }, [nombrepdf, reloadEliminar]);

  const descargarPdf = async (desembolsosId, archivo) => {
    try {
      const response = await axios.get(
        `${apiKey}/respaldodesembolsos/descargardesembidarchiv/${desembolsosId}/${archivo}`,
        {
          headers,
          responseType: "blob",
        }
      );

      const contentDisposition = response.headers["content-disposition"];
      let serverFilename = `${archivo} ${desembolsosId}.pdf`;

      if (contentDisposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);

        if (matches && matches[1]) {
          serverFilename = matches[1].replace(/['"]/g, "");
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", serverFilename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      let errorMessage = "Error desconocido al descargar el PDF";
      if (error.response && error.response.data instanceof Blob) {
        const blob = await error.response.data;
        const reader = new FileReader();
        reader.onload = () => {
          errorMessage = reader.result;
          setRespuestaDescargar(`RS: ${errorMessage}`);
          setAbrirErrorDescarga(true);
        };
        reader.readAsText(blob);
      } else if (error.response && error.response.data) {
        errorMessage = error.response.data;
        setRespuestaDescargar(`RS: ${errorMessage}`);
        setAbrirErrorDescarga(true);
      } else {
        errorMessage = error.message || "Error desconocido al descargar el PDF";
        setRespuestaDescargar(`RS: ${errorMessage}`);
        setAbrirErrorDescarga(true);
      }
    }
  };

  const eliminarPdf = async (desembolsosId, archivo) => {
    try {
      const response = await axios.get(
        `${apiKey}/respaldodesembolsos/eliminardesembidarchiv/${desembolsosId}/${archivo}`,
        {
          headers,
        }
      );
      if (response.status === 200) {
        setRespuestaFindallone(null);
        setReloadEliminar((prevState) => !prevState);
        setErrorEliminar(null);
        setRespuestaEliminar(`RS: ${response.data}`);
        setAbrirEliminar(true);
        setRespuestaFindallone([]);
        // obtenerDatosFindAllOne();
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setErrorEliminar(`RS: ${data.message}`);
        } else if (status === 500) {
          setErrorEliminar(`RS: ${data.message}`);
        }
      } else if (error.request) {
        setErrorEliminar("RF: No se pudo obtener respuesta del servidor");
      } else {
        setErrorEliminar("RF: Error al enviar la solicitud");
      }
    }
  };

  const columns = [
    {
      id: "bajarelimi",
      label: "DESCARGAR | ELIMINAR",
      minWidth: 50,
      align: "center",
    },
    {
      id: "detalle",
      label: "DETALLE",
      minWidth: 100,
      align: "center",
    },
    {
      id: "fecha_insert",
      label: "FECHA",
      minWidth: 100,
      align: "center",
      format: (value) => formatearFecha(value),
    },
    {
      id: "referencia",
      label: "REFERENCIA",
      minWidth: 100,
      align: "center",
    },
  ];

  // const rows = respuestaFindallone;
  const rows = respuestaFindallone.map((row) => ({
    ...row,
    fecha_insert: formatearFecha(row.fecha_insert), // Formatear la fecha para cada fila
  }));
  /* const rows =
    respuestaFindallone?.map((row) => ({
      ...row,
      fecha_insert: formatearFecha(row.fecha_insert),
    })) || []; */

  return (
    <>
      {errorRespuestaFindallone && (
        <p className="text-red-700 text-center p-5">
          {errorRespuestaFindallone}
        </p>
      )}
      {ErrorEliminar && (
        <p className="text-red-700 text-center p-5">{ErrorEliminar}</p>
      )}
      {respuestaEliminar !== null && (
        <Dialog
          open={abrirEliminar}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setAbrirEliminar(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {respuestaEliminar && (
                <p className="text-center m-2 text-green-500">
                  {respuestaEliminar}
                </p>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setAbrirEliminar(false);
                // , dispatch(increment());
              }}
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {respuestaDescargar && (
        <Dialog
          open={abrirErrorDescarga}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setAbrirErrorDescarga(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <p className="text-center m-2 text-red-500">
                {respuestaDescargar}
              </p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <DialogActions>
              <Button
                onClick={() => {
                  setAbrirErrorDescarga(false);
                }}
              >
                Cerrar
              </Button>
            </DialogActions>
          </DialogActions>
        </Dialog>
      )}
      {respuestaFindallone.length > 0 && (
        // respuestaFindallone.map((item) => (
        <>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <>
                        {/* <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
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
                          // className={classes.tableCell}
                        >
                          {column.label}
                        </StyledTableCell>
                      </>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align="center"
                            style={{ textAlign: "center" }}
                          >
                            {column.id === "bajarelimi" ? (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  // key={item.id}
                                  className="grid grid-cols-1 "
                                >
                                  <div>
                                    {/* <p className="">{item.detalle}</p> */}
                                  </div>
                                  <div>
                                    <ButtonGroup
                                      variant="text"
                                      aria-label="text button group"
                                    >
                                      <Tooltip
                                        title="Descargar PDF"
                                        placement="top"
                                      >
                                        <Button
                                          size="small"
                                          color="error"
                                          onClick={() => {
                                            descargarPdf(
                                              row.desembolsos_id,
                                              row.archivo
                                            );
                                          }}
                                          endIcon={
                                            <PictureAsPdfRoundedIcon size="large" />
                                          }
                                        ></Button>
                                      </Tooltip>
                                      <Tooltip
                                        title="Eliminar PDF"
                                        placement="right-start"
                                      >
                                        <Button
                                          disabled={
                                            obtenerFirmadorUserId() !== 1
                                          }
                                          size="small"
                                          color="error"
                                          onClick={() => {
                                            eliminarPdf(
                                              row.desembolsos_id,
                                              row.archivo
                                            );
                                          }}
                                          endIcon={
                                            <DeleteRoundedIcon size="large" />
                                          }
                                        ></Button>
                                      </Tooltip>
                                    </ButtonGroup>
                                  </div>
                                </div>
                              </div>
                            ) : column.id === "respaldo" ? (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <p className="">{row.detalle}</p>
                                {/* <ActualizarUser idActualizarUser={row.id} /> */}
                              </div>
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <Instructivo
            nombrepdf={nombrepdf}
            codigoProyecto={codigoProyecto}
            idDesembolso={idDesembolso}
            selectVContCodPCodid={selectVContCodPCodid}
            esVivienda={esVivienda}
            esPemar={esPemar}
            proyecMostrarCod={proyecMostrarCod}
          />
        </>
      )}
    </>
  );
}
