import { createTheme } from "@mui/material/styles";

const generateTheme = (mainColor) => {
  return createTheme({
    palette: {
      primary: {
        main: mainColor,
      },
    },
  });
};

export const c50 = generateTheme("#f0faff");
export const c100 = generateTheme("#e0f5fe");
export const c200 = generateTheme("#bae8fd");
export const c300 = generateTheme("#7dd5fc");
export const c400 = generateTheme("#38bcf8");
export const c500 = generateTheme("#0ea5e9");
export const c600 = generateTheme("#028ac7");
export const c700 = generateTheme("#0370a1");
export const c800 = generateTheme("#075e85");
export const c900 = generateTheme("#0c506e");
export const c950 = generateTheme("#083549");
