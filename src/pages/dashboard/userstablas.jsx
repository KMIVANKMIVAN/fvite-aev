import { useState, useEffect } from "react";

import { BuscarUser } from "../../components/BuscarUser";
import { CrearUser } from "../../components/CrearUser";
import { TablaUser } from "../../components/TablaUser";

export function UsersTablas() {
  const urltable = "/dashboard/usertablas";
  const [showUserTablas, setShowUserTablas] = useState(false);

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
        onHideUserTablas={() => setShowUserTablas(false)}
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
