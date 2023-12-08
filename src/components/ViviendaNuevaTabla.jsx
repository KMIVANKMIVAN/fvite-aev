import React, { useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";
import { obtenerToken } from "../utils/auth";

import SubirPdf from "./subirpdf";

export function ViviendaNuevaTabla() {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const [datoscontratoData, setDatoscontratoData] = useState([]);
  const [contcodData, setContcodData] = useState([]);
  const [contcodComplejaData, setContcodComplejaData] = useState([]);
  const [selectedContCod, setSelectedContCod] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${apiKey}/datoscontrato/findAllDatosContrato`;
        const token = obtenerToken();

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(url, { headers });

        if (response.status === 200) {
          setDatoscontratoData(response.data);
        } else {
          console.error("Error fetching user data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData2 = async () => {
      if (selectedContCod) {
        try {
          const url = `${process.env.NEXT_PUBLIC_BASE_URL_BACKEND}/datoscontrato/contcod/${selectedContCod}`;
          const token = obtenerToken();

          const headers = {
            Authorization: `Bearer ${token}`,
          };

          const response = await axios.get(url, { headers });

          if (response.status === 200) {
            console.log("hola");
            setContcodData(response.data);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    fetchData2();
  }, [selectedContCod]);

  console.log("11111");
  console.log({ contcodData });

  useEffect(() => {
    const fetchData3 = async () => {
      if (contcodData.length > 0) {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;
          const plocCodParams = contcodData
            .map((item) => `ploccod=${item.ploc_cod}`)
            .join("&");

          const url = `${baseUrl}/datoscontrato/compleja/${selectedContCod}/${contcodData[0].titr_cod}?${plocCodParams}`;

          const token = obtenerToken();

          const headers = {
            Authorization: `Bearer ${token}`,
          };

          const response = await axios.get(url, { headers });

          if (response.status === 200) {
            setContcodComplejaData(response.data);
          } else {
            console.error("Error fetching user data");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
    fetchData3();
  }, [contcodData]);

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

  const columns3 = useMemo(
    () => [
      {
        header: "SUBIR ARCHIVO",
        size: 50,
        Cell: ({ row }) => (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <SubirPdf />
          </div>
        ),
      },
      {
        header: "SUBIR ARCHIVO BANCO",
        size: 50,
        Cell: ({ row }) => (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <SubirPdf />
          </div>
        ),
      },
      {
        accessorKey: "iddesem",
        header: "ID",
        size: 50,
      },
      {
        accessorKey: "proyecto_id",
        header: "proyecto_id",
        size: 50,
      },
      {
        accessorKey: "monto_fisico",
        header: "monto_fisico",
        size: 50,
      },
      {
        accessorKey: "descuento_anti_reten",
        header: "descuento_anti_reten",
        size: 50,
      },
      {
        accessorKey: "multa",
        header: "multa",
        size: 50,
      },
      {
        accessorKey: "monto_desembolsado",
        header: "monto_desembolsado",
        size: 50,
      },
      {
        accessorKey: "tipo_planilla",
        header: "tipo_planilla",
        size: 50,
      },
      {
        accessorKey: "checklist",
        header: "checklist",
        size: 50,
      },
      {
        accessorKey: "idcuenta",
        header: "idcuenta",
        size: 50,
      },
      {
        accessorKey: "estado",
        header: "estado",
        size: 50,
      },
      {
        accessorKey: "fecha_insert",
        header: "fecha_insert",
        size: 50,
      },
      {
        accessorKey: "fecha_update",
        header: "fecha_update",
        size: 50,
      },
      {
        accessorKey: "id_user",
        header: "id_user",
        size: 50,
      },
      {
        accessorKey: "fecha_generado",
        header: "fecha_generado",
        size: 50,
      },
      {
        accessorKey: "monto_contrato",
        header: "monto_contrato",
        size: 50,
      },
      {
        accessorKey: "mes",
        header: "mes",
        size: 50,
      },
      {
        accessorKey: "gestion",
        header: "gestion",
        size: 50,
      },
      {
        accessorKey: "id_pago",
        header: "id_pago",
        size: 50,
      },
      {
        accessorKey: "fecha_banco",
        header: "fecha_banco",
        size: 50,
      },
      {
        accessorKey: "id_user_vobo",
        header: "id_user_vobo",
        size: 50,
      },
      {
        accessorKey: "fecha_vobo",
        header: "fecha_vobo",
        size: 50,
      },
      {
        accessorKey: "fecha_abono",
        header: "fecha_abono",
        size: 50,
      },
      {
        accessorKey: "proy_cod",
        header: "proy_cod",
        size: 50,
      },
      {
        accessorKey: "cont_cod",
        header: "cont_cod",
        size: 50,
      },
      {
        accessorKey: "titr_cod",
        header: "titr_cod",
        size: 50,
      },
      {
        accessorKey: "ploc_cod",
        header: "ploc_cod",
        size: 50,
      },
      {
        accessorKey: "numero_inst",
        header: "numero_inst",
        size: 50,
      },
      {
        accessorKey: "numero_factura",
        header: "numero_factura",
        size: 50,
      },
      {
        accessorKey: "objeto",
        header: "objeto",
        size: 50,
      },
      {
        accessorKey: "procesocontratacion",
        header: "procesocontratacion",
        size: 50,
      },
      {
        accessorKey: "uh",
        header: "uh",
        size: 50,
      },
      {
        accessorKey: "observacion",
        header: "observacion",
        size: 50,
      },
      {
        accessorKey: "cite",
        header: "cite",
        size: 50,
      },
      {
        accessorKey: "archivo",
        header: "archivo",
        size: 50,
      },
      {
        accessorKey: "open",
        header: "open",
        size: 50,
      },
      {
        accessorKey: "justificacion_anulacion",
        header: "justificacion_anulacion",
        size: 50,
      },
      {
        accessorKey: "fecha_anulado",
        header: "fecha_anulado",
        size: 50,
      },
      {
        accessorKey: "id_user_anulacion",
        header: "id_user_anulacion",
        size: 50,
      },
      {
        accessorKey: "observaciones_pago",
        header: "observaciones_pago",
        size: 50,
      },
      {
        accessorKey: "archivoxls",
        header: "archivoxls",
        size: 50,
      },
      {
        accessorKey: "sigepro_id",
        header: "sigepro_id",
        size: 50,
      },
      {
        accessorKey: "id_dpto",
        header: "id_dpto",
        size: 50,
      },
      {
        accessorKey: "id_planilla",
        header: "id_planilla",
        size: 50,
      },
      {
        accessorKey: "Observaciones_Sistemas",
        header: "Observaciones_Sistemas",
        size: 50,
      },
      {
        accessorKey: "activo",
        header: "activo",
        size: 50,
      },
      {
        accessorKey: "migrado_fecha_abono",
        header: "migrado_fecha_abono",
        size: 50,
      },
      {
        accessorKey: "id",
        header: "ID",
        size: 50,
      },
      {
        accessorKey: "etapa",
        header: "ETAPA",
        size: 50,
      },
      {
        accessorKey: "fechagenerado",
        header: "fechagenerado",
        size: 50,
      },
      {
        accessorKey: "fechabanco",
        header: "fechabanco",
        size: 50,
      },
      {
        accessorKey: "monto_desembolsado",
        header: "monto_desembolsado",
        size: 50,
      },
    ],
    []
  );

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-5 py-1 lg:px-4">
        <p className="text-mi-color-primario text-2xl font-bold">
          Generacion Instruccion de Desembolso Vivienda Nueva
        </p>
        <MaterialReactTable
          columns={columns}
          data={datoscontratoData}
          initialState={{ density: "compact", showColumnFilters: true }}
          enableFacetedValues
          muiTableBodyRowProps={({ row }) => ({
            onClick: (event) => {
              setSelectedContCod(row.original.cont_cod);
            },
            sx: {
              cursor: "pointer",
            },
          })}
        />
      </div>

      <br />
      {contcodComplejaData.length > 0 && (
        <div className="flex min-h-full flex-col justify-center px-5 py-1 lg:px-4">
          <p className="text-c1p text-2xl font-bold">
            PROYECTO: {contcodComplejaData[0]?.objeto || ""}
          </p>
          <br />
          <p className="text-c1p text-2xl font-bold">
            CODIGO: {contcodComplejaData[0]?.proy_cod || ""}
          </p>
          <MaterialReactTable
            enableHiding={false}
            enableGlobalFilter={false}
            enableColumnActions={false}
            enableColumnFilters={false}
            // enablePagination={false}
            enableSorting={false}
            columns={columns3}
            data={contcodComplejaData}
            enableFacetedValues
            initialState={{ density: "compact", showColumnFilters: true }}
          />
        </div>
      )}
    </>
  );
}
