import React, { useState, useEffect } from "react";
import axios from "axios";

import { obtenerToken } from "../utils/auth";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import KeyIcon from "@mui/icons-material/Key";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

import { useDispatch } from "react-redux";
import { setUser } from "../contexts/features/user/userSlice";
import { increment } from "../contexts/features/user/counterUserSlice";

export function ResetearPassword({ userId }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;
  const [open, setOpen] = useState(false);

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
        console.log("SE ACTUALIZÓ CORRECTAMENTE");
        dispatch(setUser(response.data));
        dispatch(increment());
      }
    } catch (error) {
      console.error("Error:", error);
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
      <Button onClick={handleClickOpen} endIcon={<KeyIcon />}></Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Está seguro de resetear la contraseña a 708090?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ButtonGroup
                variant="contained"
                aria-label="outlined primary button group"
              >
                <Button
                  onClick={() => {
                    resetearPassword();
                    handleClose();
                  }}
                  color="error"
                >
                  Sí
                </Button>
                <Button onClick={handleClose} autoFocus>
                  No
                </Button>
              </ButtonGroup>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}
