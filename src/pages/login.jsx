import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { guardarToken } from "../utils/auth";
import { guardarUserId, guardarUserNivel } from "../utils/userdata";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export function Login() {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;
  const navigate = useNavigate();

  const loginUrl = `${apiKey}/auth/login`;

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState(null);

  const [loginErrorMensaje, setLoginErrorMensaje] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(loginUrl, formData);

      if (response.status === 200) {
        setLoginError(null);
        const { user, access_token } = response.data;
        if (user.prioridad === 0) {
          navigate("updatepassword");
        } else if (user.prioridad === 1) {
          if (user.nivel === 1) {
            navigate("dashboard/userstablas");
          } else if (user.nivel === 40) {
            navigate("dashboardclient/busafirmar");
          } else if (user.nivel === 9) {
            navigate("dashboardclient/pemar");
          }
        }
        guardarUserId(user.id);
        guardarUserNivel(user.nivel);
        guardarToken(access_token);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setLoginError(`RS: ${data.message}`);
          setLoginErrorMensaje(`RS: ${data.error}`);
        } else if (status === 401) {
          setLoginError(`RS: ${data.message}`);
          setLoginErrorMensaje(`RS: ${data.error}`);
        } else if (status === 500) {
          setLoginError(`RS: ${data.message}`);
          setLoginErrorMensaje(`RS: ${data.error}`);
        }
      } else if (error.request) {
        setLoginError("RF: No se pudo obtener respuesta del servidor");
      } else {
        setLoginError("RF: Error al enviar la solicitud");
      }
    }
  };
  return (
    <div
      className="flex justify-center items-center h-full"
      /* style={{
        backgroundImage: `url(../public/portadalogin.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "rgba(255, 255, 255, 0.9)", // Cambia el último valor (0.5) para ajustar la transparencia
      }} */
    >
      <div className="">
        {/* <Card
          elevation={24}
          sx={{
            minWidth: { xs: 345, md: 500 }, // Establecer el ancho mínimo para xs (extra pequeño) y md (mediano)
          }}
        > */}
        <Card
          elevation={24}
          sx={{
            minWidth: { xs: 345, md: 500 }, // Establecer el ancho mínimo para xs (extra pequeño) y md (mediano)
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.05) rotateX(3deg) rotateY(3deg)",
            },
          }}
        >
          <CardMedia sx={{ height: 130 }} image="../public/portadalogin.jpg" />
          <CardContent>
            <p className="text-center my-5 text-2xl text-mi-color-primario font-bold">
              Iniciar Sesión
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-gray-900 "
                >
                  Nombre de Usuario
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="text"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                {loginErrorMensaje && (
                  <p className="text-red-700 text-center">
                    {loginErrorMensaje}
                  </p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900 "
                  >
                    Contraseña
                  </label>
                  <button
                    type="button"
                    className="text-sm font-medium leading-6 text-gray-900 hover:text-indigo-600 "
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  </button>
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
              </div>
              <div className="flex flex-wrap mx-auto py-3 justify-center items-center">
                <button
                  type="submit"
                  className=" rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Iniciar sesión
                </button>
              </div>
            </form>
            {loginError && (
              <p className="text-red-700 text-center">{loginError}</p>
            )}
          </CardContent>
          <CardMedia
            sx={{ height: 250 }}
            image="../public/portal abajo 2.jpg"
          />
        </Card>
      </div>
    </div>
  );
}
