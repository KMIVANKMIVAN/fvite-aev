import { styled } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell"; // Asegúrate de importar TableCell
import { tableCellClasses } from "@mui/material/TableCell";

const StyledTableCell = styled(TableCell)(({}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#e0f3fe",
    color: "#028ac7",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default StyledTableCell; // Exportar StyledTableCell
