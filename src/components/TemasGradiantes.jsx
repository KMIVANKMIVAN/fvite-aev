import { createTheme } from "@mui/material/styles";

const generateGradientTheme = (gradient) => {
  return createTheme({
    overrides: {
      MuiCssBaseline: {
        "@global": {
          body: {
            background: gradient,
          },
        },
      },
    },
  });
};

export const g1 = generateGradientTheme(
  "linear-gradient(45deg, #38bcf8 30%, #028ac7 90%)"
);
export const g2 = generateGradientTheme(
  "linear-gradient(45deg, #0ea5e9 30%, #0370a1 90%)"
);
export const g3 = generateGradientTheme(
  "linear-gradient(45deg, #0ea5e9 30%, #075e85 90%)"
);
export const g4 = generateGradientTheme(
  "linear-gradient(45deg, #38bcf8 30%, #075e85 90%)"
);
export const g5 = generateGradientTheme(
  "linear-gradient(45deg, #075e85 30%, #e0f5fe 90%)"
);
export const g6 = generateGradientTheme(
  "linear-gradient(45deg, #bae8fd 30%, #38bcf8 90%)"
);
export const g7 = generateGradientTheme(
  "linear-gradient(45deg, #e0f5fe 30%, #7dd5fc 90%)"
);
