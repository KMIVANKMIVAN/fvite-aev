import { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import axios from "axios";
import { obtenerToken } from "../utils/auth";

import { AcordeonUser } from "./AcordeonUser";

import Stack from "@mui/material/Stack";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import SendIcon from "@mui/icons-material/Send";

import { styled } from "@mui/material/styles";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { HabilitarDes } from "./HabilitarDes";
import { ActualizarUser } from "./ActualizarUser";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    // color: theme.palette.common.white,
    color: "#004f81",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: "#004f81",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
    // color: "#004f81",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    // backgroundColor: "#004f81",
    // maxHeight: 440,
  },
  tableCell: {
    fontSize: "0.75rem", // Tamaño de letra "xs" (extra small)
  },
});

import { useSelector } from "react-redux";

export function BuscarUser({ urltable }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const count = useSelector((state) => state.counter.value);

  const [buscar, setBuscar] = useState("");
  const [datoscontratoData, setDatoscontratoData] = useState([]);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedHabilitado, setSelectedHabilitado] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isActualizarUserVisible, setIsActualizarUserVisible] = useState(false);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setBuscar(value);
  };

  const prevCount = useRef(count);

  useEffect(() => {
    // Verifica si count cambió
    if (prevCount.current !== count) {
      // Actualiza el valor de prevCount
      prevCount.current = count;

      // Ejecuta la búsqueda
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
        setDatoscontratoData(response.data);
        setIsDataLoaded(true);
      } else {
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const showActualizarUser = (userId) => {
    setSelectedUserId(userId);
    setIsActualizarUserVisible(
      !isActualizarUserVisible || userId !== selectedUserId
    );
  };

  console.log("el id del usuario", selectedUserId);
  console.log("el habilitado del usuario", selectedHabilitado);

  const columns = [
    // { id: "seleccionar", label: "SELECCIONAR", minWidth: 100 },
    { id: "id", label: "ID", minWidth: 50 },
    { id: "actualizar", label: "ACTUALIZAR", minWidth: 100 },
    { id: "habilitardes", label: "HABILITAR DESHABILITAR", minWidth: 100 },
    { id: "habilitado", label: "HABILITADO", minWidth: 50 },
    { id: "username", label: "USUARIO", minWidth: 150 },
    { id: "superior", label: "SUPERIOR", minWidth: 50 },
    { id: "nombre", label: "NOMBRES", minWidth: 250 },
    { id: "nivel", label: "NIVEL", minWidth: 50 },
    { id: "prioridad", label: "PRIORIDAD/GENERICA", minWidth: 50 },
    { id: "id_oficina", label: "ID DE OFICINA", minWidth: 50 },
    { id: "dependencia", label: "DEPENDENCIA", minWidth: 50 },
    { id: "last_login", label: "LAST LOGIN", minWidth: 50 },
    { id: "mosca", label: "MOSCA", minWidth: 50 },
    { id: "cargo", label: "CARGO", minWidth: 350 },
    { id: "email", label: "CORREO", minWidth: 50 },
    { id: "logins", label: "LOGIN", minWidth: 50 },
    { id: "fecha_creacion", label: "FECHA DE CREACION", minWidth: 50 },
    { id: "genero", label: "GENERO", minWidth: 50 },
    { id: "id_entidad", label: "ID ENTIDAD", minWidth: 50 },
    { id: "cedula_identidad", label: "CEDULA IDENTIDAD", minWidth: 50 },
    { id: "expedido", label: "EXPENDIO", minWidth: 50 },
    { id: "super", label: "SUPER", minWidth: 50 },
    // { id: "", label: "", minWidth: 50 },
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
        // Realiza aquí cualquier lógica de carga de datos o actualización necesaria
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
        <h2 className="p-3 text-mi-color-terceario text-2xl font-bold">
          Buscar
        </h2>
        <div className="col-span-1 flex justify-center md:px-16">
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
        </div>
        <div className="flex justify-center pt-5">
          <Stack className="pl-7" spacing={2} direction="row">
            <Button
              onClick={handleSearch}
              variant="outlined"
              endIcon={<ZoomInIcon />}
            >
              Buscar
            </Button>
          </Stack>
        </div>
      </div>
      {isDataLoaded && (
        <div className="flex min-h-full flex-col justify-center px-5 py-1 lg:px-4">
          <Paper className={classes.root}>
            <TableContainer className={classes.container}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align="center"
                        style={{
                          minWidth: column.minWidth,
                          textAlign: "center",
                        }}
                        className={classes.tableCell}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <StyledTableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={index}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <StyledTableCell
                            key={column.id}
                            align="center"
                            style={{ textAlign: "center" }}
                            className={classes.tableCell}
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
                            ) : (
                              value
                            )}
                            {/* {value} */}
                          </StyledTableCell>
                        );
                      })}
                    </StyledTableRow>
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
