import React, { useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
// import { useRouter } from "next/navigation";
import axios from "axios";
import { obtenerToken } from "../utils/auth";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import { AcordeonUser } from "./AcordeonUser";

import MarginIcon from "@mui/icons-material/Margin";

export function TablaUser({ urltable }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const [datoscontratoData, setDatoscontratoData] = useState([]);
  // const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isActualizarUserVisible, setIsActualizarUserVisible] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [selectedHabilitado, setSelectedHabilitado] = useState(null);

  const fetchData = async () => {
    try {
      const url = `${apiKey}/users`;
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
    if (userId === selectedUserId) {
      setIsActualizarUserVisible(!isActualizarUserVisible);
    } else {
      setSelectedUserId(userId);
      setIsActualizarUserVisible(true);
    }
  };

  const columnas = useMemo(
    () => [
      {
        accessorKey: "seleccionar",
        header: "SELECCIONAR",
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ row }) => (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Stack direction="row" spacing={2}>
              <Button
                onClick={() => {
                  showActualizarUser(row.original.id);
                  setSelectedHabilitado(row.original.habilitado);
                }}
                variant="outlined"
                size="small"
                endIcon={<SendIcon size="small" />}
              ></Button>
            </Stack>
          </div>
        ),
      },
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
        size: 100,
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
    ],
    [selectedUserId, isActualizarUserVisible]
  );

  console.log("id", selectedUserId);

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

  const handleFetchDataClick = async () => {
    await fetchData(); // Espera a que la función fetchData termine

    // Una vez que la carga de datos está completa, actualiza el estado para ocultar el botón
    setIsDataLoaded(true);
  };

  return (
    <>
      {isDataLoaded ? (
        <div className="flex min-h-full flex-col justify-center px-5 py-1 lg:px-4">
          <MaterialReactTable
            enableHiding={false}
            // enableGlobalFilter={false}
            enableColumnActions={false}
            enableColumnFilters={false}
            // enablePagination={false}
            enableSorting={false}
            columns={columnas}
            data={datoscontratoData}
            enableFacetedValues
            initialState={{ density: "compact" }}
          />

          <br />
        </div>
      ) : (
        <Stack className="pl-7" spacing={2} direction="row">
          <Button
            onClick={handleFetchDataClick}
            variant="outlined"
            endIcon={<MarginIcon />}
          >
            Ver todos los Usuarios
          </Button>
        </Stack>
      )}
      <AcordeonUserWrapper
        isVisible={isActualizarUserVisible}
        userId={selectedUserId}
        urltable={urltable}
        selectedHabilitado={selectedHabilitado}
        onHide={setIsActualizarUserVisible}
      />
    </>
  );
}
