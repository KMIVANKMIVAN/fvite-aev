import { useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import axios from "axios";
import { obtenerToken } from "../utils/auth";

import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { AcordeonUser } from "./AcordeonUser";

export function BuscarUser(urltable) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const [buscar, setBuscar] = useState("");
  const [datoscontratoData, setDatoscontratoData] = useState([]);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setBuscar(value);
  };

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

  const columnas = useMemo(() => [
    {
      accessorKey: "id",
      header: "ID",
      size: 50,
    },
    {
      accessorKey: "habilitado",
      header: "HABILITADO",
      size: 50,
    },
    {
      accessorKey: "username",
      header: "USUARIO",
      size: 50,
    },
    {
      accessorKey: "superior",
      header: "SUPERIOR",
      size: 50,
    },
    {
      accessorKey: "nombre",
      header: "NOMBRES",
      size: 50,
    },
    {
      accessorKey: "nivel",
      header: "NIVEL",
      size: 50,
    },
    {
      accessorKey: "prioridad",
      header: "PRIORIDAD/GENERICA",
      size: 50,
    },
    {
      accessorKey: "id_oficina",
      header: "ID DE OFICINA",
      size: 50,
    },
    {
      accessorKey: "dependencia",
      header: "DEPENDENCIA",
      size: 50,
    },
    {
      accessorKey: "last_login",
      header: "LAST LOGIN",
      size: 50,
    },
    {
      accessorKey: "mosca",
      header: "MOSCA",
      size: 50,
    },
    {
      accessorKey: "cargo",
      header: "CARGO",
      size: 50,
    },
    {
      accessorKey: "email",
      header: "CORREO",
      size: 50,
    },
    {
      accessorKey: "logins",
      header: "LOGIN",
      size: 50,
    },
    {
      accessorKey: "fecha_creacion",
      header: "FECHA DE CREACION",
      size: 50,
    },
    {
      accessorKey: "genero",
      header: "GENERO",
      size: 50,
    },
    {
      accessorKey: "id_entidad",
      header: "ID ENTIDAD",
      size: 50,
    },
    {
      accessorKey: "cedula_identidad",
      header: "CEDULA IDENTIDAD",
      size: 50,
    },
    {
      accessorKey: "expedido",
      header: "EXPENDIO",
      size: 50,
    },
    {
      accessorKey: "super",
      header: "SUPER",
      size: 50,
    },
  ]);

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
          <MaterialReactTable
            enableHiding={false}
            enableGlobalFilter={false}
            enableColumnActions={false}
            enableColumnFilters={false}
            enablePagination={false}
            enableSorting={false}
            enableFacetedValues
            // initialState={{ density: "compact" }}
            columns={columnas} // Use your existing columns definition
            data={datoscontratoData} // Use your fetched user data
            editDisplayMode="row" // Example component's configuration
            enableColumnOrdering
            enableDensityToggle={false}
            enableEditing
            enableColumnPinning
            enableRowSelection
            enableStickyHeader
            initialState={{
              density: "compact",
              pagination: { pageSize: 20, pageIndex: 0 },
            }}
            memoMode="cells"
            muiTableContainerProps={{ sx: { maxHeight: "500px" } }}
            renderDetailPanel={({ row }) => <div>{row.original.firstName}</div>}
            renderTopToolbarCustomActions={() => <p>Memoized Cells</p>}
          />
          <br />
        </div>
      )}
    </>
  );
}
