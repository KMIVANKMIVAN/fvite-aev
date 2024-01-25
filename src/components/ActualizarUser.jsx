import React, { useState } from "react";
import axios from "axios";
import { obtenerToken } from "../utils/auth";

import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import { setUser } from "../contexts/features/user/userSlice";
import { increment } from "../contexts/features/user/counterUserSlice";

import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import BorderColorIcon from "@mui/icons-material/BorderColor";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function ActualizarUser({ idActualizarUser }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [userData, setUserData] = useState({
    id: idActualizarUser,
    username: "",
    superior: "",
    idOficina: "",
    dependencia: "",
    nombre: "",
    cargo: "",
    email: "",
    habilitado: "",
    nivel: "",
    genero: "",
    prioridad: "",
    id_entidad: "",
    super: "",
    cedula_identidad: "",
    expedido: "",
  });
  const [erroruserData, setErroruserData] = useState(null);
  const [errorUpdate, setErrorUpdate] = useState(null);

  async function fetchUserData() {
    if (!userData.username) {
      const getOneUrl = `${apiKey}/users/id/${idActualizarUser}`;
      try {
        const response = await axios.get(getOneUrl, { headers });
        if (response.status === 200) {
          setErroruserData(null);
          setUserData(response.data);
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 400) {
            setErroruserData(`RS: ${data.message}`);
          } else if (status === 500) {
            setErroruserData(`RS: ${data.message}`);
          }
        } else if (error.request) {
          setErroruserData("RF: No se pudo obtener respuesta del servidor");
        } else {
          setErroruserData("RF: Error al enviar la solicitud");
        }
      }
    }
  }

  fetchUserData();

  const handleInputUpdate = (e) => {
    const { name, value } = e.target;
    let uppercaseValue = value;
    if (
      name === "nombre" ||
      name === "genero" ||
      name === "expedido" ||
      name === "cargo"
    ) {
      uppercaseValue = value.toUpperCase();
    }

    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: uppercaseValue,
    }));
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    const updateUrl = `${apiKey}/users/${userData.id}`;
    try {
      const response = await axios.patch(updateUrl, userData, { headers });
      if (response.data) {
        setErrorUpdate(null);
        dispatch(setUser(response.data));
        dispatch(increment());
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setErrorUpdate(`RS: ${data.message}`);
        } else if (status === 500) {
          setErrorUpdate(`RS: ${data.message}`);
        }
      } else if (error.request) {
        setErrorUpdate("RF: No se pudo obtener respuesta del servidor");
      } else {
        setErrorUpdate("RF: Error al enviar la solicitud");
      }
    }
  };

  const [expanded, setExpanded] = useState(false);

  const handleButtonClick = () => {
    setExpanded(!expanded);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {userData.username !== "" && (
        <>
          <BorderColorIcon className="text-red-500" onClick={handleClickOpen} />
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
          >
            <DialogContent>
              <form className="space-y-1" onSubmit={handleSubmitUpdate}>
                <Typography
                  className="text-center text-c600"
                  variant="h4"
                  gutterBottom
                >
                  Actualizar Usuario
                </Typography>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <Box sx={{ flexGrow: 1 }}>
                      <Grid container spacing={{ xs: 2 }}>
                        <Grid xs={12} sm={6}>
                          <TextField
                            id="username"
                            label="Nombre de Usuario"
                            variant="outlined"
                            name="username"
                            required
                            fullWidth
                            value={userData.username}
                            onChange={handleInputUpdate}
                          />
                        </Grid>
                        <Grid xs={12} sm={6}>
                          <TextField
                            id="nombre"
                            label="Nombres AP. Paterno AP. Materno"
                            variant="outlined"
                            name="nombre"
                            required
                            fullWidth
                            value={userData.nombre}
                            onChange={handleInputUpdate}
                          />
                        </Grid>
                        <Grid xs={12} sm={6}>
                          <TextField
                            id="superior"
                            label="Superior"
                            variant="outlined"
                            name="superior"
                            required
                            fullWidth
                            value={userData.superior}
                            onChange={handleInputUpdate}
                          />
                        </Grid>
                        <Grid xs={12} sm={6}>
                          <TextField
                            id="nivel"
                            label="Nivel"
                            variant="outlined"
                            name="nivel"
                            required
                            fullWidth
                            value={userData.nivel}
                            onChange={handleInputUpdate}
                          />
                        </Grid>
                        <Grid xs={12} sm={6}>
                          <TextField
                            id="idOficina"
                            label="Oficina"
                            variant="outlined"
                            name="idOficina"
                            required
                            fullWidth
                            value={userData.idOficina}
                            onChange={handleInputUpdate}
                          />
                        </Grid>
                        <Grid xs={12} sm={6}>
                          <TextField
                            id="dependencia"
                            label="Dependencia"
                            variant="outlined"
                            name="dependencia"
                            required
                            fullWidth
                            value={userData.dependencia}
                            onChange={handleInputUpdate}
                          />
                        </Grid>
                        <Grid xs={12}>
                          <TextField
                            id="cargo"
                            label="Cargo"
                            variant="outlined"
                            name="cargo"
                            required
                            fullWidth
                            value={userData.cargo}
                            onChange={handleInputUpdate}
                          />
                        </Grid>
                        <Grid xs={12} sm={6}>
                          <TextField
                            id="email"
                            label="Correo"
                            variant="outlined"
                            name="email"
                            required
                            fullWidth
                            value={userData.email}
                            onChange={handleInputUpdate}
                          />
                        </Grid>
                        <Grid xs={12} sm={6}>
                          <TextField
                            id="cedulaIdentidad"
                            label="Cedula de Identidad"
                            variant="outlined"
                            name="cedulaIdentidad"
                            required
                            fullWidth
                            value={userData.cedulaIdentidad}
                            onChange={handleInputUpdate}
                          />
                        </Grid>
                        <Grid xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              Género
                            </InputLabel>
                            <Select
                              label="Género"
                              id="genero"
                              name="genero"
                              required
                              value={userData.genero}
                              onChange={(e) =>
                                setUserData({
                                  ...userData,
                                  genero: e.target.value,
                                })
                              }
                            >
                              <MenuItem value="Seleccionar">
                                Seleccionar
                              </MenuItem>
                              <MenuItem value="HOMBRE">Masculino</MenuItem>
                              <MenuItem value="MUJER">Femenino</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              Expendio
                            </InputLabel>
                            <Select
                              label="Expendio"
                              id="expedido"
                              name="expedido"
                              required
                              value={userData.expedido}
                              onChange={(e) =>
                                setFormData({
                                  ...userData,
                                  expedido: e.target.value,
                                })
                              }
                            >
                              <MenuItem value="Seleccionar">
                                Seleccionar
                              </MenuItem>
                              <MenuItem value="LPZ">LPZ</MenuItem>
                              <MenuItem value="OR">OR</MenuItem>
                              <MenuItem value="CB">CB</MenuItem>
                              <MenuItem value="CH">CH</MenuItem>
                              <MenuItem value="SC">SC</MenuItem>
                              <MenuItem value="BE">BE</MenuItem>
                              <MenuItem value="PD">PD</MenuItem>
                              <MenuItem value="PT">PT</MenuItem>
                              <MenuItem value="TJ">TJ</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6}>
                          <TextField
                            id="idEntidad"
                            label="Entidad"
                            variant="outlined"
                            name="idEntidad"
                            required
                            fullWidth
                            value={userData.idEntidad}
                            onChange={handleInputUpdate}
                          />
                        </Grid>
                        <Grid xs={12} sm={6}>
                          <TextField
                            id="habilitado"
                            label="Habilitado"
                            variant="outlined"
                            name="habilitado"
                            required
                            fullWidth
                            value={userData.habilitado}
                            onChange={handleInputUpdate}
                          />
                        </Grid>
                        <Grid xs={12} sm={6}>
                          <TextField
                            id="super"
                            label="Super"
                            variant="outlined"
                            name="super"
                            required
                            fullWidth
                            value={userData.super}
                            onChange={handleInputUpdate}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} variant="outlined">
                    Cerrar
                  </Button>
                  <Button
                    variant="outlined"
                    color="success"
                    type="submit"
                    onClick={() => {
                      handleButtonClick();
                      handleClose();
                    }}
                  >
                    Guardar
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
            {errorUpdate && (
              <p className="text-red-700 text-center">{errorUpdate}</p>
            )}
            {erroruserData && (
              <p className="text-red-700 text-center">{erroruserData}</p>
            )}
          </Dialog>
        </>
      )}
    </>
  );
}
