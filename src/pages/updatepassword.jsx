import { useState } from "react";
import axios from "axios";

import { obtenerToken } from "../utils/auth";
import { obtenerUserId } from "../utils/userdata";

import Bicentenario from "../assets/Bicentenario.png";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import validator from "validator";
import { Button } from "@mui/material";

export function UpdatePassword() {
  const userId = obtenerUserId();

  const [error, setError] = useState(null);
  const [error2, setError2] = useState(null);

  const [formData, setFormData] = useState({
    password: "",
    antiguop: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    `Mínimo 8 Caracteres, Símbolos, Números, Mayúsculas, Minúsculas: No se cambiará`
  );

  const validate = (password) => {
    if (!password) {
      setErrorMessage(
        "Mínimo 8 Caracteres, Símbolos, Números, Mayúsculas, Minúsculas: No se cambiará"
      );
    } else if (
      validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      setErrorMessage("Contraseña Segura");
    } else {
      setErrorMessage(
        "Mínimo 8 Caracteres, Símbolos, Números, Mayúsculas, Minúsculas: No se cambiará"
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "password" || name === "confirmPassword") {
      validate(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password === formData.confirmPassword) {
      try {
        const token = obtenerToken();
        const url = `${
          import.meta.env.VITE_BASE_URL_BACKEND
        }/users/updatepassword/${userId}/${formData.antiguop}`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.patch(
          url,
          { password: formData.password },
          { headers }
        );
        if (response.status === 200) {
          console.log("Contraseña actualizada con éxito");
          window.location.href = "/";
        } else {
          console.error("Error al actualizar la contraseña");
        }
      } catch (error) {
        setError("No ingreso la contraseña Anterior");
        console.error("Error:", error);
      }
    } else {
      setError2("Las contraseñas no coinciden");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-full">
        <div className="py-10">
          <Card sx={{ maxWidth: { xs: 350, md: 500 } }} elevation={24}>
            <CardActionArea>
              <CardMedia sx={{ height: 250 }} image={Bicentenario} />
              <CardContent>
                <Typography
                  className="text-center text-mi-color-terceario  "
                  variant="h4"
                  gutterBottom
                >
                  Actualiza tu Contraseña
                </Typography>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={{ xs: 2 }}>
                    <Grid xs={12}>
                      <TextField
                        id="antiguop"
                        name="antiguop"
                        label="Contraseña Anterior"
                        variant="outlined"
                        required
                        fullWidth
                        value={formData.antiguop}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <TextField
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        label="Contraseña"
                        variant="outlined"
                        required
                        fullWidth
                        value={formData.password}
                        onChange={handleInputChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <VisibilityOffIcon />
                                ) : (
                                  <VisibilityIcon />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <TextField
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        label="Actualizar contraseña"
                        variant="outlined"
                        required
                        fullWidth
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <VisibilityOffIcon />
                                ) : (
                                  <VisibilityIcon />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                  <br />
                  <Grid className="flex flex-wrap mx-auto justify-center items-center">
                    <Button
                      variant="outlined"
                      type="submit"
                      className={`rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                        errorMessage.includes("No se cambiará") ||
                        formData.password !== formData.confirmPassword
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={
                        errorMessage.includes("No se cambiará") ||
                        formData.password !== formData.confirmPassword
                      }
                    >
                      Actualizar contraseña
                    </Button>
                  </Grid>
                </form>
                {error2 && (
                  <p className="text-red-500 text-lg text-center">{error2}</p>
                )}
                <p className="text-red-500 text-lg text-center">{error}</p>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      </div>
    </>
  );
}
