import React, { useContext, useState, useEffect } from "react";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Grid from "@mui/material/Grid";

import Typography from "@mui/material/Typography";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";

import axios from "axios";
import { obtenerToken } from "../../utils/auth";
import { obtenerUserId } from "../../utils/userdata";

import { CambiarEstado } from "./CambiarEstado";

import ZoomInIcon from "@mui/icons-material/ZoomIn";

import { DatosComplViviend } from "../DatosComplViviend";
import { DatosPemar } from "../DatosPemar";

export function MostrarDerivacionPorEstados({ estado }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const [busonDerivacion, setBusonDerivacion] = useState([]);
  const [errorBusonDerivacion, setErrorBusonDerivacion] = useState(null);

  const [errorEstado, setErrorEstado] = useState(null);
  const [estadoOptions, setEstadoOptions] = useState([]);

  // const [fechaInicio, setFechaInicio] = useState("");
  // const [fechaFin, setFechaFin] = useState("");

  const hoy = new Date();
  const primerDiaDelMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const diaActual = hoy.toISOString().slice(0, 10);

  const [fechaInicio, setFechaInicio] = useState(primerDiaDelMes);
  const [fechaFin, setFechaFin] = useState(diaActual);

  const [recargarTabla, setRecargarTabla] = useState(false);

  const [selectedRowData, setSelectedRowData] = useState([]);

  const handleComponentRender = (rowData) => {
    console.log("///", rowData);
    setSelectedRowData(rowData);
  };

  const handleFechaInicioChange = (event) => {
    setFechaInicio(event.target.value);
  };

  const handleFechaFinChange = (event) => {
    setFechaFin(event.target.value);
  };

  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    // Asegúrate de que esta búsqueda solo se ejecute una vez al cargar el componente.
    handleSearch();
  }, []);
  const handleSearch = async () => {
    if (!recargarTabla) return;
    try {
      const url = `${apiKey}/derivacion/busonderivacionfecha/${obtenerUserId()}/${fechaInicio}/${fechaFin}/${estado}`;
      const response = await axios.get(url, { headers });

      if (response.status === 200) {
        setRecargarTabla(false);
        setErrorBusonDerivacion(null);
        setBusonDerivacion(response.data);
      }
    } catch (error) {
      setRecargarTabla(false);
      setErrorBusonDerivacion(manageError(error));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${apiKey}/estado/menosenviado`;
        const response = await axios.get(url, { headers });

        if (response.status === 200) {
          setErrorEstado(null);
          setEstadoOptions(response.data);
        }
      } catch (error) {
        setErrorEstado(manageError(error));
      }
    };
    fetchData();
  }, []);

  // Función auxiliar para manejar errores de las peticiones
  function manageError(error) {
    if (error.response) {
      const { status, data } = error.response;
      return `RS: ${data.message}`;
    } else if (error.request) {
      return "RF: No se pudo obtener respuesta del servidor";
    } else {
      return "RF: Error al enviar la solicitud";
    }
  }

  function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    return `${fecha.getMonth() + 1}/${fecha.getDate()}/${fecha.getFullYear()}`;
  }

  const columns = [
    // { id: "id", label: "ID", minWidth: 50, align: "center" },
    { id: "estado", label: "ESTADO ACTUAL", minWidth: 50, align: "center" },
    {
      id: "renderComponent",
      label: "Ver",
      minWidth: 150,
      align: "center",
    },
    {
      id: "codigo_proyecto",
      label: "CODIGO DE PROYECTO",
      minWidth: 50,
      align: "center",
    },

    {
      id: "actualizarestado",
      label: "ACTUALIZAR ESTADO",
      minWidth: 50,
      align: "center",
    },
    {
      id: "id_desembolso",
      label: "DESEMBOLSO",
      minWidth: 50,
      align: "center",
    },
    {
      id: "cargo",
      label: "FIRMADOR ACTUAL",
      minWidth: 150,
      align: "center",
    },
    {
      id: "fecha_envio",
      label: "FECHA DE ENVIO",
      minWidth: 50,
      align: "center",
      format: (value) => formatearFecha(value),
    },
    {
      id: "documento",
      label: "DOCUMENTO",
      minWidth: 50,
      align: "center",
    },
  ];

  const rows = busonDerivacion;

  // Efecto para cargar datos iniciales o recargar la tabla
  useEffect(() => {
    if (recargarTabla) {
      setBusonDerivacion([]);
      handleSearch(); // Ejecuta la búsqueda solo si recargarTabla es true.
    }
    // Dependencia en recargarTabla para reaccionar a sus cambios.
  }, [recargarTabla]);

  // console.log("hjkdfsjkhsdfjkhsdf", recargarTabla);

  return (
    <>
    <div className="flex min-h-full flex-col justify-center px-1 py-1 lg:px-4">
      {errorEstado && (
        <p className="text-red-700 text-center p-5">{errorEstado}</p>
      )}
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Typography className="p-3 text-c600 " variant="h6" gutterBottom>
            Seleccione el rango de fecha que requiere:
          </Typography>
        </Grid>
        <Grid xs={6} textAlign="end">
          <InputLabel>Fecha de inicio:</InputLabel>
          <Input
            variant="filled"
            type="date"
            id="fechaInicio"
            value={fechaInicio}
            onChange={handleFechaInicioChange}
          />
        </Grid>
        <Grid xs={6} textAlign="start">
          <InputLabel>Fecha de fin:</InputLabel>
          <Input
            variant="filled"
            type="date"
            id="fechaFin"
            value={fechaFin}
            onChange={handleFechaFinChange}
          />
        </Grid>
        <Grid xs={12} textAlign="center">
          <Button
            onClick={() => {
              setRecargarTabla(true);
              handleSearch();
            }}
            variant="outlined"
            endIcon={<ZoomInIcon />}
            disabled={!fechaInicio || !fechaFin}
          >
            Buscar
          </Button>
          {errorBusonDerivacion && (
            <p className="text-red-700 text-center p-5">
              {errorBusonDerivacion}
            </p>
          )}
        </Grid>
      </Grid>
      {estadoOptions && (
        <>
          <Typography variant="h6" gutterBottom>
            Lista Instructivo de Desembolsos:
          </Typography>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns
                    .filter(
                      (column) =>
                        !(estado === "2" || estado === "3") ||
                        column.id !== "actualizarestado"
                    ) // Excluye la columna 'estado' si `estado` es 2 o 3.
                    .map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          fontSize: "0.8rem",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns
                      .filter(
                        (column) =>
                          !(estado === "2" || estado === "3") ||
                          column.id !== "actualizarestado"
                      ) // Aplica el mismo filtro aquí
                      .map((column) => {
                        let value = row[column.id];
                        if (column.format && typeof value === "string") {
                          value = column.format(value);
                        }
                        return (
                          <TableCell
                            key={column.id}
                            align="center"
                            style={{
                              textAlign: "center",
                              fontSize: "0.8rem",
                            }}
                          >
                            {column.id === "actualizarestado" ? (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <ButtonGroup
                                  variant="text"
                                  aria-label="Basic button group"
                                >
                                  {estadoOptions.map((option, index) => (
                                    <CambiarEstado
                                      key={index}
                                      idDerivacion={row.id}
                                      idEstado={option.id}
                                      nombreEstado={option.estado}
                                      recargar={setRecargarTabla}
                                    />
                                  ))}
                                </ButtonGroup>
                              </div>
                            ) : column.id === "estado" ? (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                {value === 1
                                  ? "Enviado"
                                  : value === 2
                                  ? "Rechazado"
                                  : "Aceptado"}
                              </div>
                            ) : column.id === "renderComponent" ? (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleComponentRender(row)}
                              >
                                Ver Proyecto
                              </Button>
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
        </>
      )}
    </div>
    {selectedRowData.esVivienda === 1 && (
      <>
        <DatosComplViviend
          selectedContCod={selectedRowData.selectVContCodPCodid}
          codigoProyecto={selectedRowData.codigo_proyecto}
          esVivienda={selectedRowData.esVivienda}
          esPemar={selectedRowData.esPemar}
        />
      </>
    )}
    {selectedRowData.esPemar === 1 && (
      <>
        <DatosPemar
          selectedCodid={selectedRowData.selectVContCodPCodid}
          codigoProyecto={selectedRowData.codigo_proyecto}
          esVivienda={selectedRowData.esVivienda}
          esPemar={selectedRowData.esPemar}
        />
      </>
    )}
    </>
  );
}
