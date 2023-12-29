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

const styles = {
  card: {
    height: "950px",
    margin: "auto",
  },
};

export function Instructivo({ nombrepdf }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const [archivo, setArchivo] = useState(undefined);
  const [archivoMandar, setArchivoMandar] = useState(null);
  const [firmado, setFirmado] = useState(false);
  const [firmas, setFirmas] = useState(undefined);

  const [respuestas, setRespuestas] = useState(null);
  const [respuestasError, setErrorRespuestas] = useState(null);

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
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent style={styles.card}>
              <h1 className="text-center py-2 text-3xl  text-mi-color-primario">
                Se Firmara el Documento PDF {""}
                <strong className="text-red-500">{nombrepdf}</strong>
              </h1>
              <h2 className="text-mi-color-primario py-2">
                Firma de documentos con el Jacobitus Total
              </h2>
              <h3 className="text-mi-color-primario py-2">
                Seleccione el documento PDF que desea firmar
              </h3>
              {respuestasError && (
                <p className="text-center m-2 text-red-500">
                  {respuestasError}
                </p>
              )}
              {respuestas && (
                <p className="text-center m-2 text-green-500">{respuestas}</p>
              )}
              <br />
              <div className="flex justify-center items-center flex-col">
                <Grid
                  container
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                  style={{ flexWrap: "wrap" }}
                >
                  <Grid item xs={12} style={{ textAlign: "center" }}>
                    <input
                      className="font-bold text-mi-color-primario file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-mi-color-primario file:text-white hover:file:bg-mi-color-terceario"
                      type="file"
                      id="archivo"
                      accept=".pdf"
                      onChange={(event) => cargarArchivoBase64(event)}
                    />
                  </Grid>
                  <Grid item xs={12} style={{ textAlign: "center" }}>
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
          <Card>
            <CardContent style={styles.card}>
              <h1 className="text-center py-2 text-3xl  text-mi-color-primario">
                Firmas de {""}
                <strong className="text-red-500">{nombrepdf}</strong>
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
                        <strong>Fecha de firma:</strong> {firma.fechaFirma}
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
      <br />
    </>
  );
}
