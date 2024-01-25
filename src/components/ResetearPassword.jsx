import React, { useState } from "react";
import axios from "axios";

import { obtenerToken } from "../utils/auth";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import Typography from "@mui/material/Typography";
import KeyIcon from "@mui/icons-material/Key";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

import { useDispatch } from "react-redux";
import { setUser } from "../contexts/features/user/userSlice";
import { increment } from "../contexts/features/user/counterUserSlice";

export function ResetearPassword({ userId }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;
  const [open, setOpen] = useState(false);
  const [errorresetearPassword, setErrorresetearPassword] = useState(null);

  const dispatch = useDispatch();

  const token = obtenerToken();
  const resetearPassword = async () => {
    try {
      const url = `${apiKey}/users/resetearpassworddefecto/${userId}`;
      const response = await axios.patch(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setErrorresetearPassword(null);
        dispatch(setUser(response.data));
        dispatch(increment());
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setErrorresetearPassword(`RS: ${data.message}`);
        } else if (status === 500) {
          setErrorresetearPassword(`RS: ${data.message}`);
        }
      } else if (error.request) {
        setErrorresetearPassword(
          "RF: No se pudo obtener respuesta del servidor"
        );
      } else {
        setErrorresetearPassword("RF: Error al enviar la solicitud");
      }
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <KeyIcon
        size="large"
        className="text-red-500"
        onClick={handleClickOpen}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Typography
          className="text-center text-c600 px-5 pt-5"
          variant="h5"
          gutterBottom
        >
          ¿Está seguro de resetear la contraseña a 708090?
        </Typography>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ButtonGroup
                variant="outlined"
                aria-label="outlined primary button group"
              >
                <Button
                  variant="outlined"
                  size="large"
                  aria-label="large button group"
                  onClick={() => {
                    resetearPassword();
                    handleClose();
                  }}
                  color="error"
                >
                  Sí
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  aria-label="large button group"
                  onClick={handleClose}
                  color="success"
                >
                  No
                </Button>
              </ButtonGroup>
              {errorresetearPassword && (
                <p className="text-red-700 text-center">
                  {errorresetearPassword}
                </p>
              )}
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}
