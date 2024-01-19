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
        <Accordion elevation={24}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className="text-center py-2 text-3xl  text-mi-color-primario">
              Verificar Documento PDF Firmados
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent style={styles.card}>
                    <h3 className="text-mi-color-primario py-2">
                      Seleccione el documento PDF que desea Verificar
                    </h3>
                    <br />
                    <div className="flex justify-center items-center flex-col">
                      <Grid container spacing={2}>
                        <Grid item md={12} xl={8}>
                          <input
                            className=" font-bold text-mi-color-primario
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-mi-color-primario file:text-white
                  hover:file:bg-mi-color-terceario"
                            type="file"
                            id="archivo"
                            accept=".pdf"
                            onChange={(event) => cargarArchivoBase64(event)}
                          />
                        </Grid>
                        <Grid item md={12} xl={4}>
                          <ButtonGroup
                            size="large"
                            aria-label="large button group"
                          >
                            <Button
                              size="large"
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
                <Card>
                  <CardContent style={styles.card}>
                    <h1 className="text-center py-2 text-3xl  text-mi-color-primario">
                      Firmas
                    </h1>
                    <h2 className="text-mi-color-primario py-2">
                      Validación de firmas en el documento
                    </h2>
                    <div
                      className="px-3 bg-mi-color-primario text-white"
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
                          <div key={index} className="border p-3 my-3">
                            <h1 className="text-center text-2xl">
                              <strong>Información del Certificado </strong>
                            </h1>
                            <p className="px-3">
                              <strong>Fecha de firma:</strong>{" "}
                              {firma.fechaFirma}
                            </p>
                            <h1 className="text-center text-2xl">
                              <strong>Titular</strong>
                            </h1>
                            <ul className="px-3">
                              <li>
                                <strong>Nombre del signatario:</strong>{" "}
                                {firma.certificado.nombreSignatario}
                              </li>
                              <li>
                                <strong>CI:</strong> {firma.certificado.ci}
                              </li>
                              <li>
                                <strong>Organización del signatario:</strong>{" "}
                                {firma.certificado.organizacionSignatario}
                              </li>
                              <li>
                                <strong>Cargo del signatario:</strong>{" "}
                                {firma.certificado.cargoSignatario}
                              </li>
                              <li>
                                <strong>Correo del signatario:</strong>{" "}
                                {firma.certificado.emailSignatario}
                              </li>
                            </ul>
                            <h1 className="text-center ">
                              <strong>Emisor</strong>
                            </h1>
                            <ul className="px-3">
                              <li>
                                <strong>Nombre ECA:</strong>{" "}
                                {firma.certificado.nombreECA}
                              </li>
                              <li>
                                <strong>Descripción ECA:</strong>{" "}
                                {firma.certificado.descripcionECA}
                              </li>
                            </ul>
                            <h1 className="text-center ">
                              <strong>Periodo Validez</strong>
                            </h1>
                            <ul className="px-3">
                              <li>
                                <strong>Inicio de validez:</strong>{" "}
                                {firma.certificado.inicioValidez}
                              </li>
                              <li>
                                <strong>Fin de validez:</strong>{" "}
                                {firma.certificado.finValidez}
                              </li>
                            </ul>
                          </div>
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
