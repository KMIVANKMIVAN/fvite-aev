import { useState } from "react";
import axios from "axios";
import { obtenerToken } from "../utils/auth";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Stack from "@mui/material/Stack";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";

import { obtenerUserNivel } from "../utils/userdata";

import { useDispatch } from "react-redux";
import { setUser } from "../contexts/features/user/userSlice";
import { increment } from "../contexts/features/user/counterUserSlice";

export function CrearUser() {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const dispatch = useDispatch();
  const [errorSubmit, setErrorSubmit] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const registerUserUrl = `${apiKey}/users/create/${obtenerUserNivel()}`;
  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
    idEntidad: "",
    super: "",
    cedulaIdentidad: "",
    expedido: "",
  });
  const handleInputChange = (e) => {
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

    setFormData({ ...formData, [name]: uppercaseValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(registerUserUrl, formData, { headers });

      if (response.data) {
        setSubmit(true);
        setErrorSubmit(null);
        dispatch(setUser(response.data));
        dispatch(increment());
      }
    } catch (error) {
      if (error.response) {
        setSubmit(false);
        const { status, data } = error.response;
        if (status === 400) {
          setErrorSubmit(`RS: ${data.message}`);
        } else if (status === 401) {
          setErrorSubmit(`RS: ${data.message}`);
        } else if (status === 500) {
          setErrorSubmit(`RS: ${data.message}`);
        }
      } else if (error.request) {
        setErrorSubmit("RF: No se pudo obtener respuesta del servidor");
      } else {
        setErrorSubmit("RF: Error al enviar la solicitud");
      }
    }
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Stack className="pl-7" spacing={2} direction="row">
        <Button
          variant="outlined"
          endIcon={<AddCircleOutlineOutlinedIcon />}
          onClick={handleClickOpen}
        >
          Crear Usuarios
        </Button>
      </Stack>
      <Dialog
        open={open}
        // onClose={handleClose}
        onClose={() => {
          if (submit) {
            handleClose();
          }
          if (!errorSubmit) {
            handleClose();
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form className="space-y-1" onSubmit={handleSubmit}>
          <Typography
            className="text-center text-mi-color-terceario  pt-5"
            variant="h4"
            gutterBottom
          >
            Crear Usuario
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
                      value={formData.username}
                      onChange={handleInputChange}
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
                      value={formData.nombre}
                      onChange={handleInputChange}
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
                      value={formData.superior}
                      onChange={handleInputChange}
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
                      value={formData.nivel}
                      onChange={handleInputChange}
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
                      value={formData.idOficina}
                      onChange={handleInputChange}
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
                      value={formData.dependencia}
                      onChange={handleInputChange}
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
                      value={formData.cargo}
                      onChange={handleInputChange}
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
                      value={formData.email}
                      onChange={handleInputChange}
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
                      value={formData.cedulaIdentidad}
                      onChange={handleInputChange}
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
                        value={formData.genero}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            genero: e.target.value,
                          })
                        }
                      >
                        <MenuItem value="Seleccionar">Seleccionar</MenuItem>
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
                        value={formData.expedido}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            expedido: e.target.value,
                          })
                        }
                      >
                        <MenuItem value="Seleccionar">Seleccionar</MenuItem>
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
                      value={formData.idEntidad}
                      onChange={handleInputChange}
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
                      value={formData.habilitado}
                      onChange={handleInputChange}
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
                      value={formData.super}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <TextField
                      id="password"
                      label="Contraseña"
                      variant="outlined"
                      name="password"
                      required
                      fullWidth
                      value={formData.password}
                      onChange={handleInputChange}
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
              type="submit"
              onClick={() => {
                if (!errorSubmit) {
                  handleClose();
                }
                if (submit) {
                  handleClose();
                }
              }}
              variant="outlined"
              color="success"
            >
              Guardar
            </Button>
          </DialogActions>
        </form>
        {errorSubmit && (
          <p className="text-red-700 text-center p-5">{errorSubmit}</p>
        )}
      </Dialog>
    </>
  );
}
