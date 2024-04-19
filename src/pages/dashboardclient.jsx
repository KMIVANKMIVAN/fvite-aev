import { useState } from "react";
import { Outlet } from "react-router-dom";

import { SubMenu } from "../components/SubMenu";

import { eliminarToken } from "../utils/auth";
import {
  obtenerUserNivel,
  eliminarUserNivel,
  eliminarUserId,
  eliminarFirmadorUserId,
} from "../utils/userdata";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import { useNavigate } from "react-router-dom";

import Divider from "@mui/material/Divider";

export function DashboardClient() {
  const navigate = useNavigate();
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [fadeOut, setFadeOut] = useState(false); // Nuevo estado para la animación

  const handleDrawerToggle = () => {
    setFadeOut(true);

    setTimeout(() => {
      setDrawerOpen(!drawerOpen);
      setFadeOut(false);
    }, 300);

    const newTransform = drawerOpen ? "translateX(100%)" : "translateX(-150%)";

    setGridStyles({
      display: "block",
      transition: "transform 0.5s ease-out",
      transform: fadeOut ? newTransform : "translateX(0)",
    });
  };

  /* const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  }; */

  const toggleSubmenu = () => {
    setSubmenuOpen((prevSubmenuOpen) => !prevSubmenuOpen);
  };

  const handleSubMenuClick = () => {
    toggleSubmenu();
  };

  const handleRedirect = (url) => {
    window.open(url, "_blank");
  };

  const isGridVisible = !drawerOpen;

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Toolbar
          /* sx={{
            backgroundColor: "#028ac7",
            color: "#f0faff",
          }} */
          sx={{
            backgroundColor: "#028ac7",
            color: "#f0faff",
            position: "sticky", // Hace que la barra de herramientas sea sticky
            top: 0, // Mantiene la barra en la parte superior de la ventana
            zIndex: 1100, // Asegura que la barra de herramientas se mantenga sobre otros contenidos
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            // aria-label="menu"
            onClick={handleDrawerToggle}
          >
            {drawerOpen ? <MenuIcon /> : <CloseIcon />}
          </IconButton>
        </Toolbar>
        <Grid container>
          {isGridVisible && (
            <Grid item xs={12} lg={2}>
              <Box>
                <Paper
                  sx={{
                    borderRadius: "0px",
                    position: "sticky",
                  }}
                >
                  <List
                    sx={{
                      backgroundColor: "#028ac7",
                      color: "#f0faff",
                    }}
                  >
                    <ListItem
                      button
                      onClick={() =>
                        handleRedirect("https://firmadigital.bo/jacobitus4/")
                      }
                    >
                      <ListItemIcon
                        sx={{
                          color: "#f0faff",
                        }}
                      >
                        <TouchAppIcon />
                      </ListItemIcon>
                      <ListItemText primary="JACOBITUS TOTAL" />
                    </ListItem>
                    <Divider component="li" />
                    {obtenerUserNivel() === 1 && (
                      <ListItem
                        button
                        onClick={() => navigate("/dashboard/userstablas")}
                      >
                        <ListItemIcon
                          sx={{
                            color: "#f0faff",
                          }}
                        >
                          <SupervisedUserCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Usuarios" />
                      </ListItem>
                    )}
                    <Divider component="li" />
                    {(obtenerUserNivel() === 40 ||
                      obtenerUserNivel() === 1) && (
                      <ListItem
                        button
                        onClick={() => navigate("/dashboardclient/busafirmar")}
                      >
                        <ListItemIcon
                          sx={{
                            color: "#f0faff",
                          }}
                        >
                          <AccountBalanceIcon />
                        </ListItemIcon>
                        <ListItemText primary="BUSA" />
                      </ListItem>
                    )}
                    <Divider component="li" />
                    {(obtenerUserNivel() === 9 || obtenerUserNivel() === 1) && (
                      <>
                        <ListItem button onClick={handleSubMenuClick}>
                          <ListItemIcon
                            sx={{
                              color: "#f0faff",
                            }}
                          >
                            <AssignmentIcon />
                          </ListItemIcon>
                          <ListItemText primary="Generacion Intrucciones" />
                          {submenuOpen ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </ListItem>
                        {submenuOpen && (
                          <SubMenu
                            isOpen={submenuOpen}
                            onClose={() => setSubmenuOpen(false)}
                          />
                        )}
                      </>
                    )}
                    <Divider component="li" />
                    <ListItem
                      button
                      onClick={() => {
                        eliminarToken();
                        eliminarUserNivel();
                        eliminarUserId();
                        eliminarFirmadorUserId();
                        window.location.href = "/";
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: "#f0faff",
                        }}
                      >
                        <LogoutIcon />
                      </ListItemIcon>
                      <ListItemText primary="Cerrar Sesion" />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            </Grid>
          )}
          <Grid item xs={12} lg={drawerOpen ? 12 : 10}>
            <Box spacing={2}>
              <Outlet />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
