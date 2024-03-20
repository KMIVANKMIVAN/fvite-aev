export const guardarUserId = (id: number) => {
  if (typeof id !== "number") {
    console.error("Token no válido");
    return;
  }

  try {
    localStorage.setItem("userid", id.toString());
  } catch (error) {
    console.error("Error al guardar el user id:", error);
  }
};
export const obtenerUserId = () => {
  try {
    const userId = localStorage.getItem("userid");
    if (userId === null) {
      console.error("No se encontró el ID de usuario en el localStorage");
      return null; // o puedes devolver un valor predeterminado si lo deseas
    }

    return parseInt(userId, 10); // Convierte la cadena de ID a un número
  } catch (error) {
    console.error("Error al obtener el ID de usuario:", error);
    return null; // o un valor predeterminado en caso de error
  }
};
export const eliminarUserId = () => {
  try {
    console.log("se elimino el userid");

    localStorage.removeItem("userid");
  } catch (error) {
    console.error("Error al eliminar el userid:", error);
  }
};
export const guardarUserNivel = (nivel: number) => {
  if (typeof nivel !== "number") {
    console.error("Nivel no válido");
    return;
  }
  try {
    localStorage.setItem("usernivel", nivel.toString());
  } catch (error) {
    console.error("Error al guardar el user nivel:", error);
  }
};
export const obtenerUserNivel = () => {
  try {
    const userNivel = localStorage.getItem("usernivel");
    if (userNivel === null) {
      console.error("No se encontró el Nivel de usuario en el localStorage");
      return null; // o puedes devolver un valor predeterminado si lo deseas
    }

    return parseInt(userNivel, 10); // Convierte la cadena de ID a un número
  } catch (error) {
    console.error("Error al obtener el Nivel de usuario:", error);
    return null; // o un valor predeterminado en caso de error
  }
};
export const eliminarUserNivel = () => {
  try {
    console.log("se elimino el usernivel");

    localStorage.removeItem("usernivel");
  } catch (error) {
    console.error("Error al eliminar el usernivel:", error);
  }
};
export const guardarIdOficina = (idOficina: number) => {
  if (typeof idOficina !== "number") {
    console.error("IdOficina no válido");
    return;
  }
  try {
    console.log("11111111111111");
    console.log(idOficina.toString());

    localStorage.setItem("IdOficina", idOficina.toString());
  } catch (error) {
    console.error("Error al guardar el user IdOficina:", error);
  }
};
export const obtenerIdOficina = () => {
  try {
    const userIdOficina = localStorage.getItem("IdOficina");
    if (userIdOficina === null) {
      console.error("No se encontró el IdOficina de usuario en el localStorage");
      return null; // o puedes devolver un valor predeterminado si lo deseas
    }

    return parseInt(userIdOficina, 10); // Convierte la cadena de ID a un número
  } catch (error) {
    console.error("Error al obtener el IdOficina de usuario:", error);
    return null; // o un valor predeterminado en caso de error
  }
};
export const eliminarIdOficina = () => {
  try {
    console.log("se elimino el IdOficina");

    localStorage.removeItem("idOficina");
  } catch (error) {
    console.error("Error al eliminar el IdOficina:", error);
  }
};

