import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import ZoomInIcon from "@mui/icons-material/ZoomIn";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import axios from "axios";
import { obtenerToken } from "../../utils/auth";
import { obtenerIdOficina } from "../../utils/userdata";

// import {  } from "../../";

export function SelecUsuarioBanco({ pasar, selectedId }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const [reloadComponents, setReloadComponents] = useState(false);
  const [datoscontratoData, setDatoscontratoData] = useState([]);
  const [errorDatoscontratoData, setErrorDatoscontratoData] = useState([]);

  const [buscar, setBuscar] = useState("");
  const [idUserEncontrado, setIdUserEncontrado] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  // const [selectedId, setSelectedId] = useState("");
  // const { selectedId, setSelectedId } = useContext(FormularioContext);

  const [open, setOpen] = useState(false);

  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const columns = [
    { id: "id", label: "ID", minWidth: 50, align: "center" },
    { id: "seleccionar", label: "SELECCIONAR", minWidth: 50, align: "center" },
    { id: "nombres", label: "Nombres", minWidth: 150, align: "center" },
    { id: "apellidos", label: "Apellidos", minWidth: 150, align: "center" },
    { id: "ci", label: "CI", minWidth: 150, align: "center" },
    { id: "complemento", label: "Complemento", minWidth: 150, align: "center" },
    { id: "correo", label: "Correo", minWidth: 150, align: "center" },
  ];

  // const obIDOficina = obtenerIdOficina();

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const url = `${apiKey}/usuariobusa/findmenosadmin`;
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
    handleSearch();
  }, []);

  const rows = datoscontratoData;

  const handleInputChange = (event) => {
    const { value } = event.target;
    setBuscar(value);
  };

  const handleCheckboxChange = (event, id, nombre) => {
    if (event.target.checked) {
      setNombreUsuario(nombre); // Actualiza el estado con el nombre del usuario seleccionado
      pasar(id);
      // setSelectedId(id);
      setIdUserEncontrado(id);
      handleClose(); // Cierra el diálogo después de seleccionar un usuario
    }
  };

  // console.log(selectedId);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <TextField
        label="Destinatario"
        fullWidth
        value={nombreUsuario} // Muestra el nombre del usuario seleccionado
        onClick={handleClickOpen} // Abre el diálogo al hacer clic
        InputProps={{
          readOnly: true,
        }}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle
          className="p-3 text-c600 text-2xl"
          variant="h4"
          gutterBottom
        >
          Selecciona
        </DialogTitle>
        <DialogContent>
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
                            {column.id === "seleccionar" ? (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={(event) =>
                                        handleCheckboxChange(
                                          event,
                                          row.id,
                                          row.nombres
                                        )
                                      } // Ahora se pasa el nombre también
                                      checked={selectedId === row.id}
                                    />
                                  }
                                />
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
