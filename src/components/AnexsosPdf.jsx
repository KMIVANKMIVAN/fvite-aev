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

import { useDispatch } from "react-redux";
import { increment } from "../contexts/features/counter/counterSlice";

export function AnexsosPdf({ nombrepdf, buttonAEV }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [nomPDFAnex, setNomPDFAnex] = useState("");

  const [tipoRespaldoData, setTipoRespaldoData] = useState([]);
  const [errorTsipoRespaldoData, setErrorTipoRespaldoData] = useState(null);

  const [referencias, setReferencias] = useState(null);

  const handleReferenciasChange = (event) => {
    setReferencias(event.target.value);
  };

  useEffect(() => {
    const fetchTipoRespaldoData = async () => {
      try {
        const token = obtenerToken();
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const urlTipoRespaldo = `${apiKey}/tiporespaldo`;

        const response = await axios.get(urlTipoRespaldo, { headers });

        if (response.status === 200) {
          setTipoRespaldoData(response.data);
        }
      } catch (error) {
        setErrorTipoRespaldoData(`RS: ${error}`);
      }
    };

    fetchTipoRespaldoData();
  }, []);

  const handleChange = (event) => {
    const selectedDetalle = event.target.value;
    setSelectedValue(selectedDetalle);

    const selectedObject = tipoRespaldoData.find(
      (option) => option.detalle === selectedDetalle
    );

    if (selectedObject) {
      setNomPDFAnex(selectedObject.id);
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

  return (
    <>
      <Button
        disabled={buttonAEV}
        onClick={handleClickOpen}
        endIcon={<ArrowCircleUpIcon size="large" />}
      >
        Anexos
      </Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        {errorTsipoRespaldoData !== null && <h1>{errorTsipoRespaldoData}</h1>}
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
                  tiporesid={nomPDFAnex}
                  referencias={referencias}
                />
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose(), dispatch(increment());
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
