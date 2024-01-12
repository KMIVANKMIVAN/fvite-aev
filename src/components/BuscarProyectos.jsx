import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import axios from "axios";
import { obtenerToken } from "../utils/auth";

import SearchIcon from "@mui/icons-material/Search";

import { BuscarPemar } from "./BuscarPemar";
import { BuscarViviend } from "./BuscarViviend";

import { useSelector } from "react-redux";

export function BuscarProyectos() {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const count = useSelector((state) => state.counter.value);

  const [datoscontratoData, setDatoscontratoData] = useState([]);
  const [selectedCodid, setSelectedCodid] = useState(null);
  const [titulo, setTitulo] = useState(null);

  const [inputValue, setInputValue] = useState("");
  const [updateComponent, setUpdateComponent] = useState(0);
  const [desabilitarAEV, setDesabilitarAEV] = useState(true);

  const [errorSearch, setErrorSearch] = useState(null);

  const handleSearch = async () => {
    try {
      const url = `${apiKey}/cuadro/consultacuadro/${inputValue}`;
      const token = obtenerToken();
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });

      if (response.status === 200) {
        setErrorSearch(null);
        setDatoscontratoData(response.data);
        setSelectedCodid(0);
        if (response.data && response.data.length > 0) {
          setTitulo(response.data[0].proyecto_nombre);
        }
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setErrorSearch(`RS: ${data.message}`);
        } else if (status === 500) {
          setErrorSearch(`RS: ${data.message}`);
        }
      } else if (error.request) {
        setErrorSearch("RF: No se pudo obtener respuesta del servidor");
      } else {
        setErrorSearch("RF: Error al enviar la solicitud");
      }
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleUploadPDFs = (dataContCod) => {
    setSelectedCodid(dataContCod);
    setUpdateComponent((prev) => prev + 1);
  };

  useEffect(() => {
    handleUploadPDFs(selectedCodid);
  }, [count]);

  const elementosPorConjunto = 2;
  const conjuntosDatos = [];
  for (let i = 0; i < datoscontratoData.length; i += elementosPorConjunto) {
    conjuntosDatos.push(datoscontratoData.slice(i, i + elementosPorConjunto));
  }

  return (
    <>
      {errorSearch && (
        <p className="text-red-700 text-center p-5">{errorSearch}</p>
      )}
      <h2 className="p-3 text-mi-color-terceario text-2xl font-bold">Buscar</h2>
      <div className="col-span-1 flex justify-center px-10">
        <TextField
          name="codigo"
          helperText="Ejemplo: AEV-LP-0000"
          id="standard-basic"
          label="Codigo de Proyecto (COMPLETO)"
          variant="standard"
          className="w-full"
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex justify-center pt-5">
        <Button
          variant="outlined"
          onClick={handleSearch}
          endIcon={<SearchIcon />}
        >
          Buscar
        </Button>
      </div>
      <br />
      {errorcontcodComplejaData && (
        <BuscarPemar key={updateComponent} codigoProyecto={inputValue} />
      )}
      {errorcontcodComplejaData && (
        <BuscarViviend key={updateComponent} codigoProyecto={inputValue} />
      )}
      <br />
    </>
  );
}
