import { useState } from "react";
import axios from "axios";

import { obtenerToken } from "../utils/auth";
import { obtenerUserId } from "../utils/userdata";

import { useTheme } from "@mui/material/styles";

import Bicentenario from "../assets/Bicentenario.png";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

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
        <Card sx={{ maxWidth: 345 }} elevation={24}>
          <CardActionArea>
            <CardMedia
              component="img"
              image={Bicentenario}
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Actualiza tu Contraseña
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="antiguop"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Contraseña Anterior
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="antiguop"
                      name="antiguop"
                      autoComplete="current-password"
                      required
                      value={formData.antiguop}
                      onChange={handleInputChange}
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Contraseña
                    </label>
                    <Button
                      variant="contained"
                      type="button"
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                    </Button>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Confirmar Contraseña
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <p className="mt-1 text-center font-bold">{errorMessage}</p>
                  <div className="flex flex-wrap mx-auto py-3 justify-center items-center">
                    <Button
                      variant="contained"
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
                  </div>
                </form>
                {error2 && (
                  <p className="text-red-500 text-lg text-center">{error2}</p>
                )}
                <p className="text-red-500 text-lg text-center">{error}</p>
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    </>
  );
}
