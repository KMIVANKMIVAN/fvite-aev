import { useMemo, useState } from "react";
import { obtenerToken } from "../../utils/auth";
import { BuscarViviend } from "../../components/BuscarViviend";

// import { BuscarViviend } from "../../../../componets/buscarviviend";

import { MaterialReactTable } from "material-react-table";
import axios from "axios";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import MarginIcon from "@mui/icons-material/Margin";

export function ViviendaNueva() {
  const [showUserTabla, setShowUserTabla] = useState(false);

  const [datoscontratoData, setDatoscontratoData] = useState([]);

  const [selectedContCod, setSelectedContCod] = useState(null);

  const fetchData = async () => {
    try {
      const url = `${
        import.meta.env.NEXT_PUBLIC_BASE_URL_BACKEND
      }/datoscontrato/findAllDatosContrato`;
      const token = obtenerToken(); // Reemplaza obtenerToken() con tu lógica real para obtener el token

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });

      if (response.status === 200) {
        setDatoscontratoData(response.data);
        setShowUserTabla(true); // Muestra la tabla después de obtener los datos
      } else {
        console.error("Error: Respuesta no exitosa");
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const toggleUserTabla = async () => {
    if (!showUserTabla) {
      await fetchData();
    } else {
      setShowUserTabla(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "proy_cod",
        header: "CODIGO",
        size: 50,
      },
      {
        accessorKey: "cont_des",
        header: "PROYECTO",
        size: 50,
      },
      {
        accessorKey: "montocontrato",
        header: "MONTO CONTRATO Bs.",
        size: 50,
      },
      {
        accessorKey: "inst_des",
        header: "EMPRESA",
        size: 50,
      },
      {
        accessorKey: "bole_fechav",
        header: "ULTIMA BOLETA",
        size: 50,
      },
      {
        accessorKey: "etap_cod",
        header: "ESTADO SAP",
        size: 50,
      },
      {
        accessorKey: "depa_des",
        header: "DEPARTAMENTO",
        size: 50,
      },
    ],
    []
  );
  return (
    <>
      <BuscarViviend proy_cod={selectedContCod} />
      <br />
      <br />
      <div className="flex min-h-full flex-col justify-center px-1 lg:px-4">
        <Stack className="pl-7" spacing={2} direction="row">
          <Button
            variant="outlined"
            onClick={toggleUserTabla}
            endIcon={<MarginIcon />}
          >
            {showUserTabla
              ? "Ocultar todos los Registros"
              : "Ver todos los Registros"}
          </Button>
        </Stack>
      </div>
      <br />
      {showUserTabla && (
        <>
          <div className="flex min-h-full flex-col justify-center px-5 py-1 lg:px-4">
            <p className="text-mi-color-primario text-2xl font-bold">
              Generacion Instruccion de Desembolso Vivienda Nueva
            </p>
            <br />
            <MaterialReactTable
              columns={columns}
              data={datoscontratoData}
              initialState={{ density: "compact", showColumnFilters: true }}
              enableFacetedValues
              muiTableBodyRowProps={({ row }) => ({
                onClick: (event) => {
                  setSelectedContCod(row.original.proy_cod);
                },
                sx: {
                  cursor: "pointer",
                },
              })}
            />
          </div>
        </>
      )}
    </>
  );
}
