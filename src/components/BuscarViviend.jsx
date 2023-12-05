import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";

import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";

import axios from "axios";
import { obtenerToken } from "../utils/auth";

import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// import DatosComplViviend from "./datoscomplviviend";
import { DatosComplViviend } from "./DatosComplViviend";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function formatearNumero(numero) {
  // Verificar si el número es decimal
  const esDecimal = numero % 1 !== 0;

  // Si es un número decimal, formatear con separadores de miles y coma para decimales
  if (esDecimal) {
    const partes = numero.toFixed(2).split(".");
    const parteEntera = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${parteEntera},${partes[1]}`;
  }

  // Si es un número entero, formatear solo con separadores de miles
  return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function BuscarViviend({ proy_cod }) {
  console.log("proy_cod", proy_cod);
  const [datoscontratoData, setDatoscontratoData] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [selectedContCod, setSelectedContCod] = useState(null);

  console.log("selectedContCod de buscarvivienda", selectedContCod);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [expandedItems, setExpandedItems] = useState({});

  const [inputValue, setInputValue] = useState("");

  const [updateComponent, setUpdateComponent] = useState(0);

  const handleExpandClick = (index) => {
    setExpandedItems({
      ...expandedItems,
      [index]: !expandedItems[index],
    });
  };

  useEffect(() => {
    // Si proy_cod no es null o undefined, establecerlo como valor del TextField
    if (proy_cod !== null && proy_cod !== undefined) {
      setInputValue(proy_cod);
      setBuscar(proy_cod);
    }
  }, [proy_cod]);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
    setBuscar(value);
  };

  const handleSearch = async () => {
    console.log("Realizando la solicitud GET con valores:", buscar);
    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL_BACKEND}/documentpdf/buscar/${buscar}`;
      const token = obtenerToken();
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });

      if (response.status === 200) {
        // console.log("hola0");
        // console.log(response.data);
        setDatoscontratoData(response.data);
        setSelectedContCod(0);
      } else {
        // console.error("Error fetching user data");
      }
    } catch (error) {
      // console.error("Error:", error);
    }
  };

  const handleUploadPDFs = (dataContCod) => {
    setSelectedContCod(dataContCod);
    setUpdateComponent((prev) => prev + 1); // Incrementa el estado para forzar el renderizado
  };

  return (
    <>
      <h2 className="p-3 text-mi-color-terceario text-2xl font-bold">Buscar</h2>
      <div className="col-span-1 flex justify-center px-10">
        <TextField
          name="codigo"
          helperText="Ejemplo: AEV-LP-0000 o FASE(XIII)..."
          id="standard-basic"
          label="Codigo de Proyecto (COMPLETO) o Nombre de Proyecto:"
          variant="standard"
          className={`w-full ${
            buscar.length < 11 ? "text-red-500" : "text-green-500"
          }`}
          value={inputValue} // Utiliza el estado para controlar el valor del TextField
          onChange={handleInputChange}
        />
      </div>
      <div className="flex justify-center pt-5">
        <Button
          variant="outlined"
          onClick={handleSearch}
          // disabled={buttonDisabled}
        >
          <span className="mr-2">Buscar</span>{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </Button>
      </div>
      <br />
      <div className="flex min-h-full flex-col justify-center px-1 py-1 lg:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {datoscontratoData.map((data, index) => (
            <div key={index}>
              <Card
                elevation={24}
                sx={{
                  height: "100%", // Ajustar la altura al 100% del contenedor padre
                  width: "100%", // Ajustar el ancho al 100% del contenedor padre
                  position: "relative",
                }}
              >
                <CardContent>
                  <Typography
                    variant="body2"
                    className="text-mi-color-secundario"
                  >
                    {data.proy_cod && (
                      <>
                        <strong className="text-mi-color-secundario">
                          CODIGO:
                        </strong>{" "}
                        {data.proy_cod}
                        <br />
                      </>
                    )}
                    <strong className="text-mi-color-secundario">
                      PROYECTO:
                    </strong>{" "}
                    <br />
                    {data.cont_des}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing sx={{ display: "flex" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      "& > *": {
                        m: 1,
                      },
                    }}
                  >
                    <ButtonGroup size="small" aria-label="small button group">
                      <Button
                        size="small"
                        color="success"
                        variant="outlined"
                        endIcon={<VerticalAlignTopIcon size="large" />}
                        onClick={(event) => handleUploadPDFs(data.cont_cod)}
                      >
                        Subir PDFs
                      </Button>
                    </ButtonGroup>
                  </Box>
                  <ExpandMore
                    expand={expandedItems[index] || false}
                    onClick={() => handleExpandClick(index)}
                    aria-expanded={expandedItems[index] || false}
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                </CardActions>
                <Collapse
                  in={expandedItems[index] || false}
                  timeout="auto"
                  unmountOnExit
                >
                  <CardContent>
                    <Typography variant="body2">
                      <div className="grid grid-cols-1 md:grid-cols-2">
                        <div>
                          {data.montocontrato && (
                            <>
                              <strong className="text-mi-color-secundario">
                                MONTO CONTRATO Bs.
                              </strong>{" "}
                              {formatearNumero(data.montocontrato)}
                              <br />
                            </>
                          )}
                          {data.bole_fechav && (
                            <>
                              <strong className="text-mi-color-secundario">
                                ULTIMA BOLETA:
                              </strong>{" "}
                              {data.bole_fechav}
                              <br />
                            </>
                          )}
                          {data.bole_fechav && (
                            <>
                              <strong className="text-mi-color-secundario">
                                ULTIMA BOLETA:
                              </strong>{" "}
                              {data.bole_fechav}
                              <br />
                            </>
                          )}
                          {data.etap_cod && (
                            <>
                              <strong className="text-mi-color-secundario">
                                ESTADO SAP:
                              </strong>{" "}
                              {data.etap_cod}
                              <br />
                            </>
                          )}
                          {data.depa_des && (
                            <>
                              <strong className="text-mi-color-secundario">
                                DEPARTAMENTO:
                              </strong>{" "}
                              {data.depa_des}
                            </>
                          )}
                        </div>
                        <div>
                          {data.inst_des && (
                            <>
                              <strong className="text-mi-color-secundario">
                                EMPRESA:
                              </strong>{" "}
                              {data.inst_des}
                              <br />
                            </> ///RELACIONAR CON EL NUMERO DE CUENTA Y TUTULAR
                          )}
                        </div>
                      </div>
                    </Typography>
                  </CardContent>
                </Collapse>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <br />
      <DatosComplViviend
        key={updateComponent}
        selectedContCod={selectedContCod}
      />
    </>
  );
}
