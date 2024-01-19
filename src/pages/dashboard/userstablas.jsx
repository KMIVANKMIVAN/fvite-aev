import { useState, useEffect } from "react";
import { BuscarUser } from "../../components/BuscarUser";
import { CrearUser } from "../../components/CrearUser";
import { useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    backgroundColor: "#C9FFC2",
  },
  tableCell: {
    fontSize: "0.75rem",
  },
});

export function UsersTablas() {
  const urltable = "/dashboard/usertablas";
  const user = useSelector((state) => state.user.user);

  const [showContent, setShowContent] = useState(true);

  const classes = useStyles();
  const columns = [
    { id: "id", label: "ID", minWidth: 50 },
    { id: "habilitado", label: "HABILITADO", minWidth: 50 },
    { id: "username", label: "USUARIO", minWidth: 150 },
    { id: "superior", label: "SUPERIOR", minWidth: 50 },
    { id: "nombre", label: "NOMBRES", minWidth: 250 },
    { id: "nivel", label: "NIVEL", minWidth: 50 },
    { id: "prioridad", label: "PRIORIDAD/GENERICA", minWidth: 50 },
    { id: "id_oficina", label: "ID DE OFICINA", minWidth: 50 },
    { id: "dependencia", label: "DEPENDENCIA", minWidth: 50 },
    { id: "last_login", label: "LAST LOGIN", minWidth: 50 },
    { id: "mosca", label: "MOSCA", minWidth: 50 },
    { id: "cargo", label: "CARGO", minWidth: 350 },
    { id: "email", label: "CORREO", minWidth: 50 },
    { id: "logins", label: "LOGIN", minWidth: 50 },
    { id: "fecha_creacion", label: "FECHA DE CREACION", minWidth: 50 },
    { id: "genero", label: "GENERO", minWidth: 50 },
    { id: "id_entidad", label: "ID ENTIDAD", minWidth: 50 },
    { id: "cedula_identidad", label: "CEDULA IDENTIDAD", minWidth: 50 },
    { id: "expedido", label: "EXPENDIO", minWidth: 50 },
    { id: "super", label: "SUPER", minWidth: 50 },
  ];

  const rows = Array.isArray(user) ? user : [user];

  useEffect(() => {
    setShowContent(true);
    const timeout = setTimeout(() => {
      setShowContent(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [user]);
  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-1 py-1 lg:px-4">
        {showContent && user && (
          <>
            <Typography
              className="p-3 pl-7 text-c600 text-2xl "
              variant="h4"
              gutterBottom
            >
              Usuario Actualizado y/o Creado
            </Typography>
            <Paper className={classes.root}>
              <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align="center"
                          style={{
                            minWidth: column.minWidth,
                            textAlign: "center",
                          }}
                          className={classes.tableCell}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={index}>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align="center"
                            style={{ textAlign: "center" }}
                            className={classes.tableCell}
                          >
                            {row[column.id]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}
      </div>
      <br />
      <Typography
        className="p-3 pl-7 text-c600 text-2xl "
        variant="h4"
        gutterBottom
      >
        Usuarios
      </Typography>
      <CrearUser urltable={urltable} />
      <BuscarUser urltable={urltable} />
    </>
  );
}
