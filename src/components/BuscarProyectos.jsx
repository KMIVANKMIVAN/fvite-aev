import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import axios from "axios";
import { obtenerToken } from "../utils/auth";
import { obtenerUserId } from "../utils/userdata";

import SearchIcon from "@mui/icons-material/Search";

import { useSelector, useDispatch } from "react-redux";

import StyledTableCell from "./stilostablas/EtilosTable";

import { BuscarPemar } from "./BuscarPemar";
import { BuscarViviend } from "./BuscarViviend";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Grid from "@mui/material/Unstable_Grid2";

const columns = [
  { id: "seleccionar", label: "Seleccionar", minWidth: 70, align: "center" },
  { id: "num", label: "Codigo de Proyecto", minWidth: 100, align: "center" },
  {
    id: "proyecto_nombre",
    label: "Nombre del Proyecto",
    minWidth: 300,
    align: "center",
  },
  { id: "tipo", label: "Tipo", minWidth: 70, align: "center" },
  { id: "departamento", label: "Departamento", minWidth: 70, align: "center" },
  // { id: "", label: "", minWidth: 70 },
];

export function BuscarProyectos() {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const iduser = obtenerUserId();

  const [codigo, setCodigo] = useState("");
  const [search, setSearch] = useState(null);
  const [errorSearch, setErrorSearch] = useState(null);
  const [vivienda, setVivienda] = useState(false);
  const [pemar, setPemar] = useState(false);
  const [codigoSeleccionado, setCodigoSeleccionado] = useState("");
  const [reloadComponents, setReloadComponents] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true); // Nuevo estado para controlar la primera renderización
  const pemarArray = [5, 11, 13, 17, 15, 18];
  const viviendaArray = [1, 2, 10, 14, 19, 3, 4, 16, 9];

  const [pdfKey, setPdfKey] = useState(0);

  const updateComponent2 = useSelector((state) => state.pemar.updateComponent);

  useEffect(() => {
    if (!isFirstRender) {
      // Verificar si no es la primera renderización
      // Si no lo es, ocultar ambos componentes
      setVivienda(false);
      setPemar(false);
    } else {
      setIsFirstRender(false); // Marcar que no es la primera renderización
    }
  }, [updateComponent2]);

  const handleSearch = async () => {
    try {
      setReloadComponents(!reloadComponents);
      const url = `${apiKey}/proyectos/${codigo}/${iduser}`;
      const token = obtenerToken();
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });

      if (response.status === 200) {
        setErrorSearch(null);
        setSearch(response.data);

        setVivienda(false);
        setPemar(false);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setSearch(null);
          setErrorSearch(`RS: ${data.message}`);
        } else if (status === 500) {
          setSearch(null);
          setErrorSearch(`RS: ${data.message}`);
        }
      } else if (error.request) {
        setErrorSearch("RF: No se pudo obtener respuesta del servidor");
      } else {
        setErrorSearch("RF: Error al enviar la solicitud");
      }
    }
  };
  const handleButtonClick = (num, idTipo) => {
    setCodigoSeleccionado(num);
    setPemar(pemarArray.includes(idTipo));
    setVivienda(viviendaArray.includes(idTipo));
    setReloadComponents(!reloadComponents);
  };
  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-1 py-1 lg:px-4">
        <Typography className=" text-c600 text-2xl" variant="h4" gutterBottom>
          Buscar
        </Typography>
        <Grid container spacing={2}>
          <Grid xs={1}></Grid>
          <Grid xs={10}>
            <TextField
              name="codigo"
              helperText="Ejemplo: AEV-LP-0000"
              id="standard-basic"
              label="Codigo de Proyecto (COMPLETO)"
              variant="standard"
              className="w-full"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
            <br />{" "}
            <Button
              variant="outlined"
              onClick={handleSearch}
              endIcon={<SearchIcon />}
            >
              Buscar
            </Button>
          </Grid>
          <Grid xs={1}></Grid>
        </Grid>
        {errorSearch && (
          <p className="text-red-700 text-center p-5">{errorSearch}</p>
        )}
        <br />
        {search && (
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 272 }}>
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
                  {search && search.length > 0 ? (
                    search.map((row) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            /* onClick={() =>
                              handleButtonClick(row.num, row.idTipo)
                            } */
                            onClick={() => {
                              handleButtonClick(row.num, row.idTipo);
                              setPdfKey((prevKey) => prevKey + 1);
                            }}
                          >
                            Seleccionar
                          </Button>
                        </TableCell>
                        {columns.slice(1).map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length + 1} align="center">
                        No se encontraron resultados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </div>
      <br />
      {vivienda && (
        <BuscarViviend
          key={pdfKey}
          codigoProyecto={codigoSeleccionado}
          esVivienda={vivienda}
          esPemar={pemar}
        />
      )}
      {pemar && (
        <BuscarPemar
          key={pdfKey}
          codigoProyecto={codigoSeleccionado}
          esPemar={pemar}
          esVivienda={vivienda}
        />
      )}
      <br />
    </>
  );
}
