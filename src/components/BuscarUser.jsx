import { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import axios from "axios";
import { obtenerToken } from "../utils/auth";

import { AcordeonUser } from "./AcordeonUser";
import { ResetearPassword } from "./ResetearPassword";

import ZoomInIcon from "@mui/icons-material/ZoomIn";

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

export function BuscarUser({ urltable }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const count = useSelector((state) => state.counter.value);

  const [buscar, setBuscar] = useState("");
  const [datoscontratoData, setDatoscontratoData] = useState([]);
  const [errorDatoscontratoData, setErrorDatoscontratoData] = useState([]);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [selectedHabilitado, setSelectedHabilitado] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isActualizarUserVisible, setIsActualizarUserVisible] = useState(false);

  const [reloadComponents, setReloadComponents] = useState(false);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setBuscar(value);
  };

  const prevCount = useRef(count);

  useEffect(() => {
    if (prevCount.current !== count) {
      prevCount.current = count;
      handleSearch();
    }
  }, [count]);

  const handleSearch = async () => {
    try {
      const url = `${apiKey}/users/buscar/${buscar}`;
      const token = obtenerToken();
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });

      if (response.status === 200) {
        setReloadComponents(!reloadComponents);
        setErrorDatoscontratoData(null);
        setDatoscontratoData(response.data);
        setIsDataLoaded(true);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setErrorDatoscontratoData(`RS: ${data.message}`);
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
  const columns = [
    { id: "id", label: "ID", minWidth: 50, align: "center" },
    { id: "actualizar", label: "ACTUALIZAR", minWidth: 100, align: "center" },
    {
      id: "habilitardes",
      label: "DESHABILITADO / HABILITADO",
      minWidth: 100,
      align: "center",
    },
    {
      id: "resetear",
      label: "RESETEAR CONSTRASEñA",
      minWidth: 100,
      align: "center",
    },
    { id: "habilitado", label: "HABILITADO", minWidth: 50, align: "center" },
    { id: "username", label: "USUARIO", minWidth: 150, align: "center" },
    { id: "superior", label: "SUPERIOR", minWidth: 50, align: "center" },
    { id: "nombre", label: "NOMBRES", minWidth: 250, align: "center" },
    { id: "nivel", label: "NIVEL", minWidth: 50, align: "center" },
    {
      id: "prioridad",
      label: "PRIORIDAD/GENERICA",
      minWidth: 50,
      align: "center",
    },
    { id: "id_oficina", label: "ID DE OFICINA", minWidth: 50, align: "center" },
    { id: "dependencia", label: "DEPENDENCIA", minWidth: 50, align: "center" },
    { id: "last_login", label: "LAST LOGIN", minWidth: 50, align: "center" },
    { id: "mosca", label: "MOSCA", minWidth: 50, align: "center" },
    { id: "cargo", label: "CARGO", minWidth: 350, align: "center" },
    { id: "email", label: "CORREO", minWidth: 50, align: "center" },
    { id: "logins", label: "LOGIN", minWidth: 50, align: "center" },
    {
      id: "fecha_creacion",
      label: "FECHA DE CREACION",
      minWidth: 50,
      align: "center",
    },
    { id: "genero", label: "GENERO", minWidth: 50, align: "center" },
    { id: "id_entidad", label: "ID ENTIDAD", minWidth: 50, align: "center" },
    {
      id: "cedula_identidad",
      label: "CEDULA IDENTIDAD",
      minWidth: 50,
      align: "center",
    },
    { id: "expedido", label: "EXPENDIO", minWidth: 50, align: "center" },
    { id: "super", label: "SUPER", minWidth: 50, align: "center" },
  ];

  const rows = datoscontratoData;

  const AcordeonUserWrapper = ({
    isVisible,
    userId,
    urltable,
    onHide,
    selectedHabilitado,
  }) => {
    useEffect(() => {
      if (isVisible) {
      }
    }, [isVisible, userId, urltable]);

    return (
      isVisible && (
        <AcordeonUser
          userId={userId}
          urltable={urltable}
          selectedHabilitado={selectedHabilitado}
          hideActualizarUser={() => onHide(false)}
        />
      )
    );
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-1 py-1 lg:px-4">
        <Typography
          className="p-3 text-c600 text-2xl"
          variant="h4"
          gutterBottom
        >
          Buscar
        </Typography>
        <Grid container spacing={2}>
          <Grid xs={1}></Grid>
          <Grid xs={10}>
            <TextField
              name="codigo"
              helperText="Ejemplo: nombre.apellido o 123456789"
              id="standard-basic"
              label="Nombre de Usuario o Carnet de Identidad:"
              variant="standard"
              className="w-full "
              value={buscar}
              onChange={handleInputChange}
            />
            <br />{" "}
            <Button
              onClick={handleSearch}
              variant="outlined"
              endIcon={<ZoomInIcon />}
            >
              Buscar
            </Button>
          </Grid>
          <Grid xs={1}></Grid>
        </Grid>
      </div>
      {errorDatoscontratoData && (
        <p className="text-red-700 text-center">{errorDatoscontratoData}</p>
      )}
      {isDataLoaded && (
        <div
          key={reloadComponents}
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
                            {column.id === "habilitardes" ? (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <HabilitarDes
                                  idActualizarUser={row.id}
                                  selectedHabilitado={row.habilitado}
                                />
                              </div>
                            ) : column.id === "actualizar" ? (
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
        </div>
      )}
      <AcordeonUserWrapper
        isVisible={isActualizarUserVisible}
        userId={selectedUserId}
        urltable={urltable}
        selectedHabilitado={selectedHabilitado}
        onHide={setIsActualizarUserVisible}
      />
      <br />
    </>
  );
}
