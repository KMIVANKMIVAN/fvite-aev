import { BuscarUser } from "../../components/BuscarUser";
import { CrearUser } from "../../components/CrearUser";
import { useSelector } from "react-redux";
export function UserTablas() {
  const urltable = "/dashboard/userstablas";
  const user = useSelector((state) => state.user.user);
  console.log("8989user", user);
  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-1 py-1 lg:px-4">
        <h2 className="p-3 text-mi-color-terceario text-2xl font-bold">
          Usuarios
        </h2>
        <CrearUser urltable={urltable} />
      </div>
      <br />
      <BuscarUser urltable={urltable} />
    </>
  );
}
