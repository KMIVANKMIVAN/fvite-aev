import React, { useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import TextField from "@mui/material/TextField";
// import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";

import axios from "axios";
import { obtenerToken } from "../utils/auth";

import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
// import AcordeonUser from "./AcordeonUser";

// import { useDispatch, useSelector } from "react-redux";
// import { setUserData } from "../app/GlobalRedux/user/userSlice";

export function BuscarUser({ urltable }) {
  // const dispatch = useDispatch();
  // const router = useRouter();

   const [buscar, setBuscar] = useState("");
  const [datoscontratoData, setDatoscontratoData] = useState([]);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedHabilitado, setSelectedHabilitado] = useState(null);
  const [isActualizarUserVisible, setIsActualizarUserVisible] = useState(false);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setBuscar(value);
  };

  const handleSearch = async () => {
    try {
      const url = `${
        import.meta.env.NEXT_PUBLIC_BASE_URL_BACKEND
      }/users/buscar/${buscar}`;
      const token = obtenerToken();
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });

      if (response.status === 200) {
        setDatoscontratoData(response.data);
        // dispatch(setUserData(response.data));
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

  console.log("estoy en buscaruser", urltable);

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
            columns={columnas}
            data={datoscontratoData}
            enableFacetedValues
            initialState={{ density: "compact" }}
          />
          <br />
        </div>
      )}
      {isActualizarUserVisible && (
        <AcordeonUser
          userId={selectedUserId}
          urltable={urltable}
          hideActualizarUser={() => setIsActualizarUserVisible(false)}
        />
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
