import { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { obtenerUserNivel } from "../utils/userdata";

import axios from "axios";
import { obtenerToken } from "../utils/auth";

import { AcordeonUser } from "./AcordeonUser";
import { ResetearPassword } from "./ResetearPassword";

import ZoomInIcon from "@mui/icons-material/ZoomIn";

import { AnexsosPdf } from "./AnexsosPdf";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

import { HabilitarDes } from "./HabilitarDes";
import { ActualizarUser } from "./ActualizarUser";

import { useSelector } from "react-redux";

import { BajarEliminarAnexos } from "./BajarEliminarAnexos";

export function AnexosInstruc({ nombrepdf }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const [buscar, setBuscar] = useState("");
  const [datoscontratoData, setDatoscontratoData] = useState([]);
  const [errorDatoscontratoData, setErrorDatoscontratoData] = useState([]);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [reloadComponents, setReloadComponents] = useState(false);

  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${apiKey}/respaldodesembolsos/findallone/${nombrepdf}`;

        const response = await axios.get(url, { headers });

        if (response.status === 200) {
          setErrorDatoscontratoData(null);
          setDatoscontratoData(response.data);
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 400) {
            setErrorDatoscontratoData(`RS: ${data.error}`);
          } else if (status === 500) {
            setErrorDatoscontratoData(`RS: ${data.message}`);
          }
        } else if (error.request) {
          setErrorDatoscontratoData(
            "RF: No se pudo obtener respuesta del servidor"
          );
        } else {
          setErrorDatoscontratoData("RF: Error al enviar la solicitud");
        }
      }
    };

    fetchData();
  }, [nombrepdf]);

  const columns = [
    { id: "bajarelimi", label: "DESCARGAR | ELIMINAR", minWidth: 50, align: "center" },
    {
      id: "desembolsos_id",
      label: "INSTRUCTIVO",
      minWidth: 100,
      align: "center",
    },
    { id: "fecha_insert", label: "FECHA 1", minWidth: 100, align: "center" },
    {
      id: "tiporespaldo_id",
      label: "RESPALDO",
      minWidth: 100,
      align: "center",
    },
    {
      id: "respaldo",
      label: "REFERENCIA",
      minWidth: 100,
      align: "center",
    },
  ];

  const rows = datoscontratoData;

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-1 py-1 lg:px-4"></div>
      {errorDatoscontratoData && (
        <p className="text-red-700 text-center">{errorDatoscontratoData}</p>
      )}
      <div
        // key={reloadComponents}
        className="flex min-h-full flex-col justify-center px-5 py-1 lg:px-4"
      >
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
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
                              <BajarEliminarAnexos
                                /* nombrepdf={row.id + "-AEV"}
                                buttonAEVBUSA={
                                  row.buttonAEV === "1" ||
                                  obtenerUserNivel() === 40
                                }
                                nomCarperta={row.id} */
                                nombrepdf={nombrepdf}
                              />
                              {/* <HabilitarDes
                                idActualizarUser={row.id}
                                selectedHabilitado={row.habilitado}
                              /> */}
                            </div>
                          ) : (
                            /*  ) : column.id === "actualizar" ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <ActualizarUser idActualizarUser={row.id} />
                            </div>
                          ) : column.id === "resetear" ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <ResetearPassword userId={row.id} />
                            </div> */
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
      </div>
      <br />
    </>
  );
}
