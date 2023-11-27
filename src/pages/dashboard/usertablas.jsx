import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BuscarUser } from "../../components/BuscarUser";
import { CrearUser } from "../../components/CrearUser";
import { TablaUser } from "../../components/TablaUser";

export function UserTablas() {
  const urltable = "/dashboard/userstablas";
  const [showUserTablas, setShowUserTablas] = useState(false);
  // const userData = useSelector((state) => state.user.userData);

  const toggleUserTablas = () => {
    setShowUserTablas(!showUserTablas);
  };

  // Este efecto restablecerá el estado cuando se monte el componente
  useEffect(() => {
    setShowUserTablas(false);
  }, []);

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-1 py-1 lg:px-4">
        <h2 className="p-3 text-mi-color-terceario text-2xl font-bold">
          Usuarios
        </h2>
        <CrearUser urltable={urltable} />
      </div>
      <br />

      <br />
      <BuscarUser
        urltable={urltable}
        onHideUserTablas={() => setShowUserTablas(false)} // Pasar una función para cerrar el diálogo desde BuscarUser
      />
      <br />
      <div className="flex min-h-full flex-col justify-center px-1 py-1 lg:px-4">
        <h2 className="p-3 text-mi-color-terceario text-2xl font-bold">
          Usuarios
        </h2>
        <TablaUser urltable={urltable} />
      </div>
    </>
  );
}
