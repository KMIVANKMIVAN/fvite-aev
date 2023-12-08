import { BuscarViviend } from "../../components/BuscarViviend";
import { useSelector } from "react-redux";

export function ViviendaNueva() {
  const count = useSelector((state) => state.counter.value);
  return (
    <>
      {/* <h1 className="text-center color-mi-color-primario text-5xl">{count}</h1> */}
      <BuscarViviend />
    </>
  );
}
