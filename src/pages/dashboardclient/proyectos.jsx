import { BuscarProyectos } from "../../components/BuscarProyectos";
import { useSelector } from "react-redux";

export function Proyectos() {
  const count = useSelector((state) => state.counter.value);
  return (
    <>
      <h1
        className="py-5 text-3xl sm:text-5xl font-bold text-center relative bg-gradient-to-r from-mi-color-primario to-mi-color-sextario text-transparent bg-clip-text"
        style={{
          transition: "text-shadow 0.3s ease",
          textShadow: "4px 4px 8px rgba(0, 0, 0, 0.4)",
        }}
        onMouseOver={(e) => {
          e.target.style.textShadow = "8px 8px 16px rgba(0, 0, 0, 0.4)";
        }}
        onMouseOut={(e) => {
          e.target.style.textShadow = "4px 4px 8px rgba(0, 0, 0, 0.4)";
        }}
      >
        INSTRUCTIVOS DE DESEMBOLSO "PROYECTOS"
      </h1>
      <BuscarProyectos />
    </>
  );
}
