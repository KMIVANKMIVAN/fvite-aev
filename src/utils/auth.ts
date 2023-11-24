export const guardarToken = (token: string) => {
  try {
    if (typeof token !== "string" || token.length === 0) {
      throw new Error("Token no válido");
    }
    localStorage.setItem("token", token);
  } catch (error) {
    console.error("Error al guardar el token:", error);
  }
};

export const obtenerToken = () => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const token = window.localStorage.getItem("token");
      return token || null;
    }
  } catch (error) {
    console.error("Error al obtener el token:", error);
    return null;
  }
};

export const eliminarToken = () => {
  try {
    console.log("se elimino el token");
    
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Error al eliminar el token:", error);
  }
};
