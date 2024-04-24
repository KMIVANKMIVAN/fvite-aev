import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { obtenerToken } from "../../utils/auth";

import Box from "@mui/material/Box";

import {
  notifyFirmadoSuccess,
  notifyFirmadoError,
  notifyDerivacionSuccess,
} from "../../notificaciones/notifications.js";

import { useDispatch } from "react-redux";
import {
  setSelectedCodid,
  incrementUpdateComponent,
} from "../../contexts/features/pemar/pemarSlice.js";

// import { jacobitusTotal } from "../libs/adsib/jacobitus-total.es6.js";
import { jacobitusTotal } from "../../libs/adsib/jacobitus-total.es6.js";



import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

require("../../libs/prism/prism.min.js");
require("../../libs/prism/prism.min.css");
require("../../libs/FreezeUI/freeze-ui.min.js");
require("../../libs/FreezeUI/freeze-ui.min.css");

import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

// import { useDispatch } from "react-redux";
import { increment } from "../../contexts/features/counter/counterSlice.js";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const styles = {
  card: {
    height: "950px",
    margin: "auto",
  },
};

import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const formatearFecha = (fecha) => {
  const fechaObj = new Date(fecha);
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  };

  return fechaObj.toLocaleDateString("es-ES", options);
};

import Snackbar from "@mui/material/Snackbar";
import { SnackbarProvider, useSnackbar } from "notistack";
import Alert from "@mui/material/Alert";

// import { obtenerToken } from "../../utils/auth";
// import { obtenerUserId } from "../../utils/userdata";
// import { SelecUsuario } from "./SelecUsuario";

import { eliminarToken } from "../../utils/auth";
import { obtenerUserId, obtenerFirmadorUserId } from "../../utils/userdata";
import { SelecUsuario } from "../formulario/SelecUsuario";
import { SelecUsuarioBanco } from "../formulario/SelecUsuarioBanco.jsx";
import { AcepatRechazarBUSA } from "./AcepatRechazarBUSA.jsx";

export function InstructivoBUSA({
  idDesembolso,
  nombrepdf,
  codigoProyecto,
  esVivienda,
  esPemar,
  selectVContCodPCodid,
  proyecMostrarCod,
}) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const [open, setOpen] = useState(false);

  const [archivoMandar, setArchivoMandar] = useState(null);
  const [firmado, setFirmado] = useState(false);
  const [firmas, setFirmas] = useState(undefined);

  const [respuestas, setRespuestas] = useState(null);
  const [respuestasError, setErrorRespuestas] = useState(null);

  const [firmasVasia, setFirmasVasia] = useState(undefined);
  const [archivoCargado, setArchivoCargado] = useState(false);

  const [archivo, setArchivo] = useState(undefined);
  const [errorArchivo, setErrorArchivo] = useState(null);

  const [nombrePdf, setNombrePdf] = useState("");
  const [errorNombrePdf, setErrorNombrePdf] = useState(null);

  const [pdfBase64, setPdfBase64] = useState("");
  const [errorPdfBase64, setErrorPdfBase64] = useState("");

  const [enviarDos, setEnviarDos] = useState("");
  const [mostrarInstruc, setMostrarInstruc] = useState(false);

  const [errorEstado, setErrorEstado] = useState(null);
  const [estadoOptions, setEstadoOptions] = useState("");

  const [aceptar, setAceptar] = useState("");
  const [errorAceptar, setErrorAceptar] = useState(null);

  ////
  const [formValues, setFormValues] = useState({
    id_desembolso: idDesembolso,
    // id_desembolso: documento,

    estado: "",
    id_enviador: obtenerUserId(),
    // id_destinatario: "",
    codigo_proyecto: codigoProyecto,
    documento: nombrepdf,
    selectVContCodPCodid: selectVContCodPCodid,
    esVivienda: esVivienda,
    esPemar: esPemar,
  });

  const [derivacion, setDerivacion] = useState(null);
  const [errorderivacion, setErrorDerivacion] = useState(null);
  const [messagederivacion, setMessageDerivacion] = useState(null);

  const [selectedId, setSelectedId] = useState("");

  const [rechazar, setRechazar] = useState({
    observacion: null,
  });
  /////
  /* const [actulizarEstado, setActulizarEstado] = useState([]);
  const [errorActulizarEstado, setErrorActulizarEstado] = useState(null);
  const [formValuesEstado, setFormValuesEstado] = useState({
    observacion: null,
    estado: idEstado,
  }); */

  const [notiFirmado, setNotiFirmado] = useState(null);
  const [notiCambiarEsta, setNotiCambiarEsta] = useState(null);
  const [notiDerivar, setNotiDerivar] = useState(null);

  const [notificar, setNotificar] = useState(null);

  const [mostrarDeriv, setMostrarDeriv] = useState(false);

  const [openNotificar, setOpenNotificar] = useState(false);

  const [ocultar, setOcultar] = useState(false);
  const [ocultarError, setErrorOcultar] = useState(false);
  const [textoOcultar, setTextoOcultar] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const dispatch = useDispatch();

  const handleSomeAction = () => {
    // Aquí asumimos que quieres hacer algo inmediatamente antes del retraso de 6 segundos.
    console.log("Esta acción se ejecuta inmediatamente.");

    setTimeout(() => {
      // Este código se ejecuta después de un retraso de 6 segundos.
      console.log("Esta acción se ejecuta después de 6 segundos.");

      // Aquí va la lógica que quieres ejecutar después del retraso.
      // Por ejemplo, despachar algunas acciones de Redux:
      // dispatch(setSelectedCodid(123)); // Asegúrate de reemplazar 123 con el valor real que deseas.
      dispatch(incrementUpdateComponent());
    }, 3000);
  };

  /* const fetchPdfBase64 = async () => {
    const url = `${apiKey}/recibirpdfsenviar/firmarbasenomcompl/${idDesembolso}`;
    // const url = `${apiKey}/recibirpdfsenviar/firmarbasenomcompl/${nombrepdf}`;

    try {
      const response = await axios.get(url);
      setNombrePdf(response.data.nombrePdf);
      setPdfBase64(response.data.pdfBase64);
      setArchivo(response.data.pdfBase64);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        setErrorArchivo(`RS: ${data.error}`);
        setErrorNombrePdf(`RS: ${data.error}`);
        setErrorPdfBase64(`RS: ${data.error}`);
      } else {
        setErrorArchivo("Error al recibir el archivo");
        setErrorNombrePdf("Error al recibir el nombre del archivo");
        setErrorPdfBase64("Error al recibir el archivo en B64");
      }
    }
  }; */
  useEffect(() => {
    const fetchPdfBase64 = async () => {
      const url = `${apiKey}/recibirpdfsenviar/firmarbasenomcompl/${idDesembolso}`;
      // const url = `${apiKey}/recibirpdfsenviar/firmarbasenomcompl/${nombrepdf}`;

      try {
        const response = await axios.get(url);
        setNombrePdf(response.data.nombrePdf);
        setPdfBase64(response.data.pdfBase64);
        setArchivo(response.data.pdfBase64);
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          setErrorArchivo(`RS: ${data.error}`);
          setErrorNombrePdf(`RS: ${data.error}`);
          setErrorPdfBase64(`RS: ${data.error}`);
        } else {
          setErrorArchivo("Error al recibir el archivo");
          setErrorNombrePdf("Error al recibir el nombre del archivo");
          setErrorPdfBase64("Error al recibir el archivo en B64");
        }
      }
    };
    fetchPdfBase64();
  }, []);

  const obtenerBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString());
      reader.onerror = (error) => reject(error);
    });
  };

  const cargarArchivoBase64 = async (event) => {
    if (event.target.files) {
      FreezeUI({ text: "Cargando documento" });
      const archivoPdf = await obtenerBase64(event.target.files[0]);
      setArchivo(archivoPdf);
      setArchivoCargado(true);
    }
  };

  const firmarPdf = async () => {
    if (archivo) {
      const { value: pin } = await Swal.fire({
        title: "Ingrese su PIN",
        input: "password",
        inputLabel: "PIN",
        inputPlaceholder: "Ingrese su PIN",
        inputAttributes: {
          autocapitalize: "off",
          autocorrect: "off",
        },
        confirmButtonText: "Aceptar",
        width: "20em",
      });
      if (pin) {
        FreezeUI({ text: "Firmando documento" });
        const slot = -1;
        let respuesta =
          await jacobitusTotal.obtenerCertificadosParaFirmaDigital(slot, pin);
        if (
          respuesta.datos?.certificados &&
          respuesta.datos?.certificados.length > 0
        ) {
          const alias = respuesta.datos?.certificados[0].alias;
          respuesta = await jacobitusTotal.firmarPdf(slot, pin, alias, archivo);
          if (respuesta.datos?.docFirmado) {
            // setNotiFirmado("Se Firmo Corectamente");
            abrirNotifi(true);
            setArchivoMandar(respuesta.datos?.docFirmado);
            setFirmado(true);
            // await enviarDatosAceptacion(3);
            enviarDatosAceptacion(3);
            setMostrarDeriv(true);
            notifyFirmadoSuccess("Se Firmo Corectamente", "global-container");
          }
          setArchivo(
            `data:application/pdf;base64,${respuesta.datos?.docFirmado}`
          );
        } else {
          UnFreezeUI();
          Swal.fire({
            title: "Jacobitus Total",
            text: respuesta.mensaje,
            icon: "error",
          });
        }
      }
    }
  };

  const validarPdf = async () => {
    FreezeUI({ text: "Validando firmas Espere..." });
    const respuesta = await jacobitusTotal.validarPdf(archivo);
    if (
      respuesta.datos &&
      respuesta.datos.firmas &&
      respuesta.datos.firmas.length > 0
    ) {
      setFirmasVasia(null);
      setFirmas(respuesta.datos.firmas);
    } else {
      setFirmas([]);
      setFirmasVasia("No se encontraron firmas");
    }
    UnFreezeUI();
  };

  const limpiarComponente = () => {
    // Restablecer todos los estados a sus valores predeterminados o nulos
    setArchivoMandar(null);
    setFirmado(false);
    setFirmas(undefined);
    setRespuestas(null);
    setErrorRespuestas(null);
    setFirmasVasia(undefined);
    setArchivoCargado(false);
    setArchivo(undefined);
    setErrorArchivo(null);
    setNombrePdf("");
    setErrorNombrePdf(null);
    setPdfBase64("");
    setErrorPdfBase64(null);
    setEnviarDos("");
    setMostrarInstruc(false);

    setNotiCambiarEsta(null);
    setNotificar(null);
    setMostrarDeriv(null);
    setOpenNotificar(null);
    setNotiDerivar(null);
    setNotiFirmado(null);
    setMostrarDeriv(false);
  };

  useEffect(() => {
    if (firmas) {
      Prism.highlightAll();
    }
  }, []);

  useEffect(() => {
    if (archivo) {
      validarPdf();
    }
  }, [archivo]);

  useEffect(() => {
    if (firmas) {
      Prism.highlightAll();
    }
  }, [firmas]);

  const base64ToPdf = async () => {
    if (archivoMandar) {
      try {
        const token = obtenerToken();
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const formData = {
          base64String: archivoMandar,
          CarpetaName: idDesembolso,
          fileName: nombrepdf,
        };
        // const url = `${apiKey}/documentpdf/base64apdf/${idDesembolso}`;
        //ver para mandar dentro de la carpetajnn'jkm
        const url = `${apiKey}/recibirpdfsenviar/sobreescribir`;
        const response = await axios.post(url, formData, {
          headers: {
            ...headers,
          },
        });
        setErrorRespuestas(null);
        // setRespuestas(`RS: ${response.message}`);
        setRespuestas(`RS: ${response.data?.message}`);
      } catch (error) {
        if (error.response && error.response?.data) {
          setRespuestas(null);
          setErrorRespuestas(`RS: ${error.response?.data}`);
        } else {
          setRespuestas(null);
          setErrorRespuestas(`RF: ${error}`);
        }
      }
    }
  };
  ///////
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${apiKey}/estado/1`;
        const response = await axios.get(url, { headers });

        if (response.status === 200) {
          setErrorEstado(null);
          setEstadoOptions(response.data);
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 400 || status === 500) {
            setErrorEstado(`RS: ${data.error}`);
          }
        } else if (error.request) {
          setErrorEstado("RF: No se pudo obtener respuesta del servidor");
        } else {
          setErrorEstado("RF: Error al enviar la solicitud");
        }
      }
    };
    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const enviarDatosAceptacion = async (estadotipo) => {
    try {
      const url = `${apiKey}/derivacion/aceptar/${obtenerUserId()}/${codigoProyecto}/${nombrepdf}/${estadotipo}`; // Asegúrate de tener la URL correcta
      const body = {
        observacion: rechazar.observacion,
      };
      const response = await axios.patch(url, body);
      // const response = await axios.patch(url, { headers });

      if (response.status === 200) {
        setErrorAceptar(null);
        setAceptar(response.data);
        // setNotiCambiarEsta("Cambio el estado a:")
        setNotiCambiarEsta(
          `Cambio el estado a: ${
            estadotipo === 3 ? "Aceptado" : estadotipo === 2 ? "Rechazado" : ""
          }`
        );
        abrirNotifi(true);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 || status === 500) {
          setErrorAceptar(`RS: ${data.error}`);
        }
      } else if (error.request) {
        setErrorAceptar("RF: No se pudo obtener respuesta del servidor");
      } else {
        setErrorAceptar("RF: Error al enviar la solicitud");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      // Llamar a ambas funciones de forma asíncrona
      // const base64ToPdfPromise = base64ToPdf();
      const crearDerivacionPromise = crearDerivacion();

      // Esperar a que ambas funciones se completen
      await Promise.all([crearDerivacionPromise]);

      // Si no hay errores, puedes enviar los datos al servidor aquí
      // Puedes agregar tu lógica para enviar los datos al servidor después de que ambas funciones se completen correctamente
      console.log("Ambas funciones completadas correctamente");
    } catch (error) {
      // Manejar cualquier error que ocurra durante la ejecución de las funciones
      console.error("Error al ejecutar las funciones:", error);
    }
  };

  const crearDerivacion = async () => {
    try {
      // Asegúrate de incluir los datos correctos aquí
      const payload = {
        ...formValues,
        id_destinatario: selectedId,
      };

      const response = await axios.post(
        `${apiKey}/derivacion/automatico`,
        payload,
        {
          headers,
        }
      );

      if (response.status === 200 || response.status === 201) {
        setErrorDerivacion(null);
        setMessageDerivacion(null);
        setDerivacion(response.data);
        // setNotiDerivar("Se Envio al Siguiente Firmante");
        // abrirNotifi(true);
        base64ToPdf();
        // handleSomeAction();
        dispatch(incrementUpdateComponent());
        // limpiarComponente();
        notifyDerivacionSuccess(
          "Se Envio al Siguiente Firmante",
          "global-container"
        );
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        setErrorDerivacion(`RS: ${data.error}`);
        setMessageDerivacion(`Conflicto: ${data.message}`);
      } else {
        setErrorDerivacion(
          "Conflicto al enviar la solicitud de creación de derivación"
        );
      }
    }
  };

  const abrirNotifi = () => {
    setOpenNotificar(true);
  };

  useEffect(() => {
    const ocultarDerivar = async () => {
      try {
        const url = `${apiKey}/derivacion/ocultarderivar/${obtenerUserId()}/${codigoProyecto}/${idDesembolso}/`;
        const response = await axios.get(url, { headers });

        if (response.status === 200) {
          setErrorOcultar(null);
          setOcultar(response.data);
          if (response.data === true) {
            setTextoOcultar("Usted Ya envio el Instructivo");
          }
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 400 || status === 500) {
            setErrorOcultar(`RS: ${data.error}`);
          }
        } else if (error.request) {
          setErrorOcultar("RF: No se pudo obtener respuesta del servidor");
        } else {
          setErrorOcultar("RF: Error al enviar la solicitud");
        }
      }
    };
    ocultarDerivar();
  }, []);

  return (
    <>
      <br />
      <div
        className="ml-1 rounded-tl-lg rounded-br-lg"
        style={{ borderLeft: "10px solid #1E6091" }}
      >
        <Typography
          textAlign="center"
          variant="h4"
          gutterBottom
          className="text-c500 py-5"
        >
          INFORMACION DEL INSTRUCTIVO DE DESOMBOLSO
        </Typography>

        <Box sx={{ width: "100%", marginTop: 3 }}>
          <Grid container rowSpacing={1}>
            <Grid
              xs={12}
              md={6}
              sx={{
                height: "730px",
                width: "100%",
                // paddingX: 1,
                background:
                  "linear-gradient(90deg, rgba(2,138,199,1) 0%, rgba(125,213,252,1) 100%)",
                // background: "linear-gradient(90deg, #1CB5E0 0%, #000851 100%)",
              }}
            >
              {pdfBase64 && (
                <embed
                  className="form-control"
                  id="archivoPdf"
                  style={{ height: "100%", width: "100%" }}
                  src={`data:application/pdf;base64,${pdfBase64}`} // Utiliza pdfBase64 aquí en lugar de archivo
                />
              )}
            </Grid>
            <Grid
              xs={12}
              md={6}
              // sx={{ height: "730px", width: "100%", paddingX: 1 }}
              sx={{
                height: "730px",
                width: "100%",
                paddingX: 1,
              }}
            >
              <div
                // className="px-3   text-c500"
                style={{
                  height: "750px",
                  overflow: "scroll",
                  /* background:
                    "linear-gradient(90deg, rgba(2,138,199,1) 0%, rgba(125,213,252,1) 100%)", */
                }}
              >
                {firmasVasia && (
                  <>
                    <Typography
                      className="text-center text-red-500"
                      variant="h6"
                      gutterBottom
                    >
                      {firmasVasia}
                    </Typography>
                  </>
                )}
                {firmas &&
                  firmas.map((firma, index) => (
                    <>
                      <Card key={index} className="px-5 ">
                        <Typography
                          variant="h5"
                          gutterBottom
                          className="text-center text-c700"
                        >
                          Información del Certificado
                        </Typography>
                        <Typography
                          className=" text-c700"
                          variant="subtitle2"
                          gutterBottom
                        >
                          Fecha de firma: {""}
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            className="text-c500"
                            style={{ display: "inline-block" }}
                          >
                            {formatearFecha(firma.fechaFirma)}
                          </Typography>
                        </Typography>
                        <Typography
                          variant="h5"
                          gutterBottom
                          className="text-center text-c700"
                        >
                          Titular
                        </Typography>
                        <Typography
                          className=" text-c700"
                          variant="subtitle2"
                          gutterBottom
                        >
                          Nombre del signatario: {""}
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            className="text-c500"
                            style={{ display: "inline-block" }}
                          >
                            {firma.certificado.nombreSignatario}
                          </Typography>
                        </Typography>
                        <Typography
                          className=" text-c700"
                          variant="subtitle2"
                          gutterBottom
                        >
                          Organización del signatario: {""}
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            className="text-c500"
                            style={{ display: "inline-block" }}
                          >
                            {firma.certificado.organizacionSignatario}
                          </Typography>
                        </Typography>
                        <Typography
                          className=" text-c700"
                          variant="subtitle2"
                          gutterBottom
                        >
                          Cargo del signatario: {""}
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            className="text-c500"
                            style={{ display: "inline-block" }}
                          >
                            {firma.certificado.cargoSignatario}
                          </Typography>
                        </Typography>
                      </Card>
                      <br />
                    </>
                  ))}
              </div>
            </Grid>
          </Grid>
        </Box>
        <AcepatRechazarBUSA />
      </div>
    </>
  );
}
