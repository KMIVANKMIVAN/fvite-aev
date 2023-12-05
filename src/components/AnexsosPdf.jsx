import { useState, useEffect } from "react";
import axios from "axios";
import { obtenerToken } from "../utils/auth";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";

import { SubirBajarEliminarAnexos } from "./SubirBajarEliminarAnexos";

import { obtenerDatosFindAllOne } from "./api";

export function AnexsosPdf({ nombrepdf, refrescarFunction }) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [nomPDFAnex, setNomPDFAnex] = useState("");

  const [tipoRespaldoData, setTipoRespaldoData] = useState([]);

  const [referencias, setReferencias] = useState(null);

  const handleReferenciasChange = (event) => {
    setReferencias(event.target.value); // Actualizar el estado referencias con el valor del TextField
  };

  useEffect(() => {
    const fetchTipoRespaldoData = async () => {
      try {
        const token = obtenerToken();
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const urlTipoRespaldo = `${process.env.NEXT_PUBLIC_BASE_URL_BACKEND}/tiporespaldo`;

        const response = await axios.get(urlTipoRespaldo, { headers });

        if (response.status === 200) {
          console.log("Datos de Tipo Respaldo recibidos:", response.data);
          setTipoRespaldoData(response.data);
        } else {
          console.error(
            "Error al obtener los datos de Tipo Respaldo:",
            response.statusText
          );
          // Manejo del error si es necesario
        }
      } catch (error) {
        console.error("Error al obtener los datos de Tipo Respaldo:", error);
        // Manejo del error si es necesario
      }
    };

    fetchTipoRespaldoData();
  }, []);

  const handleChange = (event) => {
    const selectedDetalle = event.target.value;
    setSelectedValue(selectedDetalle);

    // Encontrar el objeto correspondiente al detalle seleccionado
    const selectedObject = tipoRespaldoData.find(
      (option) => option.detalle === selectedDetalle
    );

    if (selectedObject) {
      setNomPDFAnex(selectedObject.id); // Guardar el ID en la variable en lugar de la sigla
      console.log("ID seleccionado:", selectedObject.id); // Imprimir en un log el ID seleccionado
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  const handleClick = () => {
    obtenerDatosFindAllOne(
      selectedContCod,
      setContcodComplejaData,
      setErrorContcodComplejaData
    );
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        endIcon={<ArrowCircleUpIcon size="large" />}
        color="error"
      >
        Anexos
      </Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Anexos PDFs AEV</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="demo-dialog-native">Seleccionar</InputLabel>
              <Select
                native
                value={selectedValue}
                onChange={handleChange}
                input={
                  <OutlinedInput label="Seleccionar" id="demo-dialog-native" />
                }
              >
                <option aria-label="None" value="" />
                {tipoRespaldoData.map((option) => (
                  <option key={option.id} value={option.detalle}>
                    {option.detalle}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Box>
          {selectedValue && (
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div>
                <TextField
                  id="standard-basic"
                  label="Referencias"
                  variant="standard"
                  value={referencias}
                  onChange={handleReferenciasChange}
                />
              </div>
              <div className="pt-3">
                <SubirBajarEliminarAnexos
                  iddesem={nombrepdf}
                  TipoResId={nomPDFAnex}
                  referencias={referencias}
                />
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
