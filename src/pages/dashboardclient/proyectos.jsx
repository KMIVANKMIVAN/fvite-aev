import { BuscarProyectos } from "../../components/BuscarProyectos";
import Typography from "@mui/material/Typography";

export function Proyectos() {
  return (
    <>
      <Typography
        className="pt-5 text-center relative bg-gradient-to-r from-c600 to-c400 text-transparent bg-clip-text"
        gutterBottom
        sx={{
          fontSize: { xs: "h5.fontSize", sm: "h3.fontSize" },
          transition: "text-shadow 0.3s ease",
          textShadow: "4px 4px 8px rgba(0, 0, 0, 0.4)",
        }}s
        onMouseOver={(e) => {
          e.target.style.textShadow = "8px 8px 16px rgba(0, 0, 0, 0.4)";
        }}
        onMouseOut={(e) => {
          e.target.style.textShadow = "4px 4px 8px rgba(0, 0, 0, 0.4)";
        }}
      >
        INSTRUCTIVOS DE DESEMBOLSO "PROYECTOS"
      </Typography>
      <BuscarProyectos />
    </>
  );
}
