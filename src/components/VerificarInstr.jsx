import React, { useEffect, useState } from "react";

import { jacobitusTotal } from "../libs/adsib/jacobitus-total.es6.js";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import TextField from "@mui/material/TextField";
require("../libs/prism/prism.min.js");
require("../libs/prism/prism.min.css");
require("../libs/FreezeUI/freeze-ui.min.js");
require("../libs/FreezeUI/freeze-ui.min.css");

import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { useDispatch } from "react-redux";
import { increment } from "../contexts/features/counter/counterSlice.js";

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
export function VerificarInstr() {
  const [archivo, setArchivo] = useState(undefined);
  const [firmas, setFirmas] = useState(undefined);
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
      const archivoPdf = await obtenerBase64(event.target.files[0]);
      setArchivo(archivoPdf);
      setArchivoCargado(true);
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

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-1 py-1 lg:px-4">
        <Accordion elevation={3}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className="text-c500" variant="subtitle2" gutterBottom>
              Verificar Documento PDF Firmados
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card elevation={3}>
                  <CardContent style={styles.card}>
                    <Typography
                      className="text-c500 text-center"
                      variant="h6"
                      gutterBottom
                    >
                      Seleccione el documento PDF que desea Verificar
                    </Typography>
                    <div className="flex justify-center items-center flex-col">
                      <Grid container spacing={2}>
                        <Grid item md={12} lg={9}>
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
                          {/* <TextField
                            variant="standard"
                            size="small"
                            type="file"
                            inputProps={{
                              accept: ".pdf",
                            }}
                            onChange={(event) => cargarArchivoBase64(event)}
                          /> */}
                        </Grid>
                        <Grid item md={12} lg={3}>
                          <ButtonGroup
                            size="large"
                            aria-label="large button group"
                          >
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
                        {archivoCargado && ( // Mostrar el embed solo si el archivo está cargado
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
                  <CardContent style={styles.card}>
                    <Typography
                      className="text-c500 text-center"
                      variant="h6"
                      gutterBottom
                    >
                      Firmas
                    </Typography>
                    <Typography
                      className="text-c500"
                      variant="subtitle2"
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
                          <br />
                          <h1 className="text-center">
                            <strong>{firmasVasia}</strong>
                          </h1>
                          <br />
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
                                {formatearFecha(
                                  firma.certificado.inicioValidez
                                )}
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
          </AccordionDetails>
        </Accordion>
      </div>
      <br />
    </>
  );
}
