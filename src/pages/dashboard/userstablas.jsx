import React, { useState, useEffect } from "react";

// import { useRouter } from "next/navigation";

import { BuscarUser } from "../../components/BuscarUser";
import { CrearUser } from "../../components/CrearUser";
import { TablaUser } from "../../components/TablaUser";

export function UsersTablas() {
  // useStore.getState().setDatoscontratoData([1, 2, 3]);

  // console.log(datoscontratoData);

  // const router = useRouter();
  const urltable = "/dashboard/usertablas";
  const [showUserTablas, setShowUserTablas] = useState(false);

  // const userData = useSelector((state) => state.user.userData);

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
