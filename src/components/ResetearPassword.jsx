import React, { useState, useEffect } from "react";
import axios from "axios";
import { obtenerToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";

export function ResetearPassword({ userId, urltable }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const navigate = useNavigate();

  const passwordId = userId;

  const [formData, setFormData] = useState({ password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = obtenerToken();
      const url = `${apiKey}/users/resetpassword/${passwordId}`;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.patch(url, formData, { headers });

      if (response.status === 200) {
        navigate(urltable);
      } else {
        console.error("Error al actualizar la contraseña");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [expanded, setExpanded] = useState(false);

  const handleButtonClick = () => {
    setExpanded(!expanded);
  };
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    handleClickOpen();
  }, []);

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Contraseña
          </label>
          <button
            type="button"
            className="text-sm font-medium leading-6 text-gray-900 hover:text-indigo-600"
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
        <Stack spacing={2} direction="row">
          <Button
            variant="outlined"
            type="submit"
            onClick={handleButtonClick}
            color="success"
          >
            Guardar
            <SaveIcon />
          </Button>
        </Stack>
      </form>
    </>
  );
}
