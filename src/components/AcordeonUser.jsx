import { useState, useEffect } from "react";
import axios from "axios";
import { obtenerToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

import { ActualizarUser } from "./ActualizarUser";
import { ResetearPassword } from "./ResetearPassword";
// import  from "./resetearpassword";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

import Stack from "@mui/material/Stack";
import CheckIcon from "@mui/icons-material/Check";
import NotInterestedIcon from "@mui/icons-material/NotInterested";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export function AcordeonUser(userId, urltable, selectedHabilitado) {
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  console.log("estoy en acordeon", userId);

  const [expanded, setExpanded] = useState("panel1");
  const [value, setValue] = useState(0);

  console.log("estoy en acordeonuse", urltable);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleButtonClick = () => {
    setExpanded(!expanded);
  };
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    handleClickOpen(); // Abre el Dialog cuando el componente se monta
  }, []); // El segundo argumento es un array vacío para que se ejecute solo una vez al montarse el componente

  const actualizarEstado = async (selectedUserIdHabilitado, nuevoEstado) => {
    try {
      const url = `${apiKey}/users/${selectedUserIdHabilitado}`;
      const token = obtenerToken();

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.patch(
        url,
        { habilitado: nuevoEstado },
        { headers }
      );

      if (response.status === 200) {
        console.log("por que no vas");

        // router.push(urltable);
        navigate(urltable);
      } else {
        console.error("Error al actualizar el estado del usuario");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography>HABILITAR / DESABILITAR</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <div className="text-center" style={{ width: "100%" }}>
                    <Stack direction="row" spacing={2}>
                      <Button
                        onClick={() => {
                          const nuevoEstado = selectedHabilitado === 1 ? 0 : 1;
                          actualizarEstado(userId, nuevoEstado);
                        }}
                        variant="outlined"
                        color={
                          selectedHabilitado === 1 ? "secondary" : "success"
                        }
                        endIcon={
                          selectedHabilitado === 1 ? (
                            <CheckIcon />
                          ) : (
                            <NotInterestedIcon />
                          )
                        }
                        style={{ margin: "0 auto" }}
                      >
                        {selectedHabilitado === 1 ? "DESABILITAR" : "HABILITAR"}
                      </Button>
                    </Stack>
                  </div>
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <AccordionSummary
                aria-controls="panel2d-content"
                id="panel2d-header"
              >
                <Typography>RESETAR CONTRASEÑA</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <ResetearPassword userId={userId} urltable={urltable} />
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel3"}
              onChange={handleChange("panel3")}
            >
              <AccordionSummary
                aria-controls="panel2d-content"
                id="panel2d-header"
              >
                <Typography>ACTUALIZAR USUARIO</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <ActualizarUser userId={userId} urltable={urltable} />
                </Typography>
              </AccordionDetails>
            </Accordion>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            style={{
              color: "red",
              fontWeight: "bold",
              transition: "color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.color = "darkred")}
            onMouseOut={(e) => (e.target.style.color = "red")}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
