import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { obtenerToken } from "../utils/auth";

import { jacobitusTotal } from "../libs/adsib/jacobitus-total.es6.js";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

require("../libs/prism/prism.min.js");
require("../libs/prism/prism.min.css");
require("../libs/FreezeUI/freeze-ui.min.js");
require("../libs/FreezeUI/freeze-ui.min.css");

import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { useDispatch } from "react-redux";
import { increment } from "../contexts/features/counter/counterSlice.js";
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

export function InstructivoBanco({ nombrepdf }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const [archivo, setArchivo] = useState(undefined);
  const [archivoMandar, setArchivoMandar] = useState(null);
  const [firmado, setFirmado] = useState(false);
  const [firmas, setFirmas] = useState(undefined);

  const [respuestas, setRespuestas] = useState(null);
  const [respuestasError, setErrorRespuestas] = useState(null);

  const [resivirPDF, setResivirPDF] = useState(null);
  const [resivirPDFError, setErrorResivirPDF] = useState(null);
  const [PDFenBASE64, setPDFenBASE64] = useState(null);
  const [nomPDF, setNomPDF] = useState("");

  const [firmasVasia, setFirmasVasia] = useState(undefined);
  const [archivoCargado, setArchivoCargado] = useState(false);

  const dispatch = useDispatch();

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
      // const archivoPdf = await obtenerBase64(event.target.files[0]);
      const archivoPdf = PDFenBASE64;
      setArchivo(archivoPdf);
      setArchivoCargado(true);
    }
  };

  const handleNomPDFChange = (event) => {
    setNomPDF(event.target.value);
  };

  const handleBuscarPDFClick = async () => {
    if (nomPDF) {
      await pdfSearch(); // Asegúrate de que pdfSearch() sea una función asincrónica
    } else {
      alert("Por favor, ingrese un nombre de PDF antes de buscar.");
    }
  };

  const pdfSearch = async () => {
    try {
      const urlTipoRespaldo = `${apiKey}/generarpdfs/enviarpdf/${nomPDF}`;
      const response = await axios.get(urlTipoRespaldo, {
        responseType: "arraybuffer",
      });
      if (response.status === 200) {
        setErrorResivirPDF(null);
        const pdfBuffer = Buffer.from(response.data, "binary");
        const base64PDF = pdfBuffer.toString("base64");
        setArchivo(`data:application/pdf;base64,${base64PDF}`);
        setArchivoCargado(true);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 || status === 500) {
          setErrorResivirPDF(`RS: ${data.message}`);
        }
      } else if (error.request) {
        setErrorResivirPDF("RF: No se pudo obtener respuesta del servidor");
      } else {
        setErrorResivirPDF("RF: Error al enviar la solicitud");
      }
    }
  };

  /* const pdfSearch = async () => {
    try {
      const urlTipoRespaldo = `${apiKey}/generarpdfs/enviarpdf/${nomPDF}`;
      const response = await axios.get(urlTipoRespaldo);
      if (response.status === 200) {
        setErrorResivirPDF(null);
        const pdfBuffer = Buffer.from(response.data, "binary"); // Crea un buffer a partir de los bytes del PDF
        const base64PDF = pdfBuffer.toString("base64"); // Convierte el buffer a base64
        setPDFenBASE64(base64PDF);
        setResivirPDF(response.data);
      }
      
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setErrorResivirPDF(`RS: ${data.message}`);
        } else if (status === 500) {
          setErrorResivirPDF(`RS: ${data.message}`);
        }
      } else if (error.request) {
        setErrorResivirPDF("RF: No se pudo obtener respuesta del servidor");
      } else {
        setErrorResivirPDF("RF: Error al enviar la solicitud");
      }
    }
  }; */

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
            setArchivoMandar(respuesta.datos?.docFirmado);
            setFirmado(true);
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
    FreezeUI({ text: "Validando firmas" });
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
          fileName: nombrepdf,
        };
        const url = `${apiKey}/documentpdf/base64apdf`;
        const response = await axios.post(url, formData, {
          headers: {
            ...headers,
          },
        });
        setErrorRespuestas(null);
        setRespuestas(`RS: ${response.data}`);
      } catch (error) {
        if (error.response && error.response.data) {
          setRespuestas(null);
          setErrorRespuestas(`RS: ${error.response.data}`);
        } else {
          setRespuestas(null);
          setErrorRespuestas(`RS: ${error}`);
        }
      }
    }
  };

  return (
    <>
      <TextField
        type="text"
        value={nomPDF}
        onChange={handleNomPDFChange}
        label="Outlined"
        variant="outlined"
      />
      <Button onClick={handleBuscarPDFClick} variant="outlined">
        Buscar PDF
      </Button>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent style={styles.card}>
              <Typography
                className=" text-c500"
                variant="h6"
                gutterBottom
                style={{ textAlign: "center", display: "block" }}
              >
                Se Firmara el Documento PDF {""}
                <Typography
                  variant="h5"
                  gutterBottom
                  className="text-red-500"
                  style={{ display: "inline-block" }}
                >
                  {nombrepdf}
                </Typography>
              </Typography>
              <Typography
                className="text-c500"
                variant="subtitle1"
                gutterBottom
              >
                Firma de documentos con el Jacobitus Total
              </Typography>
              <Typography
                className="text-c500"
                variant="subtitle1"
                gutterBottom
              >
                Seleccione el documento PDF que desea firmar
              </Typography>
              {respuestasError && (
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  className="text-center m-2 text-red-500"
                >
                  {respuestasError}
                </Typography>
              )}
              {respuestas && (
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  className="text-center m-2 text-green-500"
                >
                  {respuestas}
                </Typography>
              )}
              <div className="flex justify-center items-center flex-col">
                <Grid
                  container
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                  style={{ flexWrap: "wrap" }}
                >
                  <Grid item xs={12} md={6} style={{ textAlign: "center" }}>
                    <Button
                      size="small"
                      component="label"
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                    >
                      Seleccionar PDF
                      <VisuallyHiddenInput
                        type="file"
                        accept=".pdf" // Limita la selección solo a archivos PDF
                        onChange={(event) => cargarArchivoBase64(event)}
                      />
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6} style={{ textAlign: "center" }}>
                    <ButtonGroup size="large" aria-label="large button group">
                      <Button
                        size="small"
                        onClick={() => firmarPdf()}
                        value="Firmar"
                      >
                        Firmar
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        endIcon={<SaveIcon />}
                        style={{ display: firmado ? "inline-block" : "none" }}
                        onClick={base64ToPdf}
                      >
                        Subir al Servidor
                      </Button>
                      <Button
                        size="small"
                        onClick={() => dispatch(increment())}
                        endIcon={<RestartAltIcon />}
                      >
                        Limpiar
                      </Button>
                    </ButtonGroup>
                  </Grid>
                </Grid>
              </div>
              <br />
              <div className="grid grid-cols-12">
                <div className="col-span-12" style={{ height: "710px" }}>
                  {archivoCargado && (
                    <embed
                      className="form-control"
                      id="archivoPdf"
                      style={{ height: "100%", width: "100%" }}
                      src={archivo}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography
                className=" text-c500"
                variant="h6"
                gutterBottom
                style={{ textAlign: "center", display: "block" }}
              >
                Firmas de {""}
                <Typography
                  variant="h5"
                  gutterBottom
                  className="text-red-500"
                  style={{ display: "inline-block" }}
                >
                  {nombrepdf}
                </Typography>
              </Typography>
              <Typography
                className="text-c500"
                variant="subtitle1"
                gutterBottom
              >
                Validación de firmas en el documento
              </Typography>
              <div
                className="px-3  text-c500"
                style={{ height: "825px", overflow: "scroll" }}
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
                    <Card elevation={3} key={index} className="px-5">
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
                        CI: {""}
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          className="text-c500"
                          style={{ display: "inline-block" }}
                        >
                          {firma.certificado.ci}
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
                      <Typography
                        className=" text-c700"
                        variant="subtitle2"
                        gutterBottom
                      >
                        Correo del signatario: {""}
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          className="text-c500"
                          style={{ display: "inline-block" }}
                        >
                          {firma.certificado.emailSignatario}
                        </Typography>
                      </Typography>
                      <Typography
                        variant="h5"
                        gutterBottom
                        className="text-center text-c700"
                      >
                        Emisor
                      </Typography>
                      <Typography
                        className=" text-c700"
                        variant="subtitle2"
                        gutterBottom
                      >
                        Nombre ECA: {""}
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          className="text-c500"
                          style={{ display: "inline-block" }}
                        >
                          {firma.certificado.nombreECA}
                        </Typography>
                      </Typography>
                      <Typography
                        className=" text-c700"
                        variant="subtitle2"
                        gutterBottom
                      >
                        Descripción ECA: {""}
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          className="text-c500"
                          style={{ display: "inline-block" }}
                        >
                          {firma.certificado.descripcionECA}
                        </Typography>
                      </Typography>
                      <Typography
                        variant="h5"
                        gutterBottom
                        className="text-center text-c700"
                      >
                        Periodo Validez
                      </Typography>
                      <Typography
                        className=" text-c700"
                        variant="subtitle2"
                        gutterBottom
                      >
                        Inicio de validez: {""}
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          className="text-c500"
                          style={{ display: "inline-block" }}
                        >
                          {formatearFecha(firma.certificado.inicioValidez)}
                        </Typography>
                      </Typography>
                      <Typography
                        className=" text-c700"
                        variant="subtitle2"
                        gutterBottom
                      >
                        Fin de validez: {""}
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          className="text-c500"
                          style={{ display: "inline-block" }}
                        >
                          {formatearFecha(firma.certificado.finValidez)}
                        </Typography>
                      </Typography>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <br />
    </>
  );
}
