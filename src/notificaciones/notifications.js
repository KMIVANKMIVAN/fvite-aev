import { toast } from "react-toastify";

export const notifySuccess = (msg, containerId) => {
  toast.success(`${msg}`, {
    containerId: containerId,
    position: "top-center",
    autoClose: 5000,
  });
};

export const notifyInfo = (msg, containerId) => {
  toast.info(`${msg}`, {
    containerId: containerId,
    position: "top-center",
    autoClose: false,
  });
};
export const notifyError = (msg, containerId) => {
  toast.error(`${msg}`, {
    containerId: containerId,
    position: "top-center",
    autoClose: 5000,
  });
};

export const notifyFirmadoSuccess = (msg, containerId) => {
  toast.success(`${msg}`, {
    containerId: containerId,
    position: "top-center",
    autoClose: 5000,
  });
};

export const notifyFirmadoInfo = (msg, containerId) => {
  toast.info(`${msg}`, {
    containerId: containerId,
    position: "top-center",
    autoClose: false,
  });
};
export const notifyFirmadoError = (msg, containerId) => {
  toast.error(`${msg}`, {
    containerId: containerId,
    position: "top-center",
    autoClose: 5000,
  });
};

export const notifyDerivacionSuccess = (msg, containerId) => {
  toast.success(`${msg}`, {
    containerId: containerId,
    position: "top-center",
    autoClose: 5000,
  });
};

export const notifyDerivacionInfo = (msg, containerId) => {
  toast.info(`${msg}`, {
    containerId: containerId,
    position: "top-center",
    autoClose: false,
  });
};
export const notifyDerivacionError = (msg, containerId) => {
  toast.error(`${msg}`, {
    containerId: containerId,
    position: "top-center",
    autoClose: 5000,
  });
};
