import React, { useState, useEffect } from "react";
import { useRouteError } from "react-router-dom";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import per1 from "../assets/per1.png";
import per2 from "../assets/per2.png";

export function ErrorPage() {
  const error = useRouteError();
  const isSpanish = navigator.language.includes("es");

  const [moveImages, setMoveImages] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMoveImages((prevMoveImages) => !prevMoveImages);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Container className="pt-10">
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <Grid item xs={12}>
          <Typography className="text-center" variant="h4" color="error">
            {isSpanish
              ? "Lo sentimos, hubo un error al cargar la página."
              : error.statusText || error.message}
          </Typography>
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={2}>
          <Box
            sx={{
              transform: moveImages
                ? "translate(0%, 0%)"
                : "translate(-50%, -50%)",
              transition: "transform 1s",
            }}
          >
            <img
              src={per1}
              alt="Error 404"
              style={{ width: 300, height: 300 }}
            />
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            sx={{
              transform: moveImages
                ? "translate(0%, 0%)"
                : "translate(50%, -50%)",
              transition: "transform 1s",
            }}
          >
            <img
              src={per2}
              alt="Error 404"
              style={{ width: 300, height: 300 }}
            />
          </Box>
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
    </Container>
  );
}
