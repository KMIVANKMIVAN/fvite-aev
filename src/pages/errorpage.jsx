import React from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import error404 from "../assets/error404.png";

export function ErrorPage() {
  const navigate = useNavigate(); // Utiliza useNavigate en lugar de useHistory
  const error = useRouteError();

  const handleGoBack = () => {
    navigate(-1); // Esta línea hace que vaya a la página anterior
  };

  return (
    <Container>
      <Grid
        container
        // justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            animation: "fadeInUp 1s ease-in-out",
            "@keyframes fadeInUp": {
              from: { transform: "translateY(50px)", opacity: 0 },
              to: { transform: "translateY(0)", opacity: 1 },
            },
          }}
        >
          <Typography variant="h4" gutterBottom>
            Algo no está bien...
          </Typography>
          <Typography className="md:pr-10" variant="subtitle1" gutterBottom>
            La página que estás intentando abrir no existe. Es posible que haya
            escrito mal la dirección o el La página se ha movido a otra URL.{" "}
            <br /> Si cree que se trata de un error, comuníquese con el soporte.
            {/* {error.statusText || error.message}s */}
          </Typography>
          <Button variant="outlined" onClick={handleGoBack}>
            Volver a la página anterior
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            animation: "fadeInUp 1s ease-in-out, heartbeat 1.5s infinite",
            "@keyframes fadeInUp": {
              from: { transform: "translateY(50px)", opacity: 0 },
              to: { transform: "translateY(0)", opacity: 1 },
            },
            "@keyframes heartbeat": {
              from: { transform: "scale(1)" },
              "50%": { transform: "scale(1.05)" },
              to: { transform: "scale(1)" },
            },
          }}
        >
          <img src={error404} alt="Error 404" />
        </Grid>
      </Grid>
    </Container>
  );
}
