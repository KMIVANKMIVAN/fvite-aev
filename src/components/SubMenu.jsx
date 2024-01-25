import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GiteIcon from "@mui/icons-material/Gite";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ArticleIcon from "@mui/icons-material/Article";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";

const submenuItems = [
  { icon: <GiteIcon />, text: "Proyectos", path: "/dashboardclient/proyectos" },
  {
    icon: <AssessmentIcon />,
    text: "Gastos Extraudinarios",
    path: "/dashboardclient/gastosextra",
  },
  {
    icon: <ArticleIcon />,
    text: "Pagos C.U.T.",
    path: "/dashboardclient/pagoscut",
  },
  {
    icon: <AssignmentTurnedInIcon />,
    text: "Firmados AEV y BUSA",
    path: "/dashboardclient/busaaevfirmados",
  },
];

export function SubMenu({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleItemClick = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <List>
      {submenuItems.map((item, index) => (
        <>
          {index < submenuItems.length - 1 && <Divider component="li" />}
          <ListItem
            button
            key={index}
            onClick={() => handleItemClick(item.path)}
          >
            <ListItemIcon
              sx={{
                color: "#f0faff",
              }}
              className="ml-4"
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
          {index < submenuItems.length - 1 && <Divider component="li" />}
        </>
      ))}
    </List>
  );
}
