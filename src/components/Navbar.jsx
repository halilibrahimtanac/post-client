import { AppBar, Box, Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import React, { useState } from "react";
import { AccountCircleOutlined, Logout } from "@mui/icons-material"
import { useNavigate } from "react-router-dom";
import { useLogOutMutation } from "../store/user/mutation";
import { useSelector } from "react-redux";

const Navbar = () => {
  const user = useSelector(state => state.data.user);
  const navigate = useNavigate();
  const [logout] = useLogOutMutation();
  const [anchorEl, setAnchorEl] = useState();

  const logOutHandler = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#fff",
        boxShadow: "none",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, color: "#333" }}
        >
          MyApp
        </Typography>
        <Box>
          <Button
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ textTransform: 'none', color: "#333", display: "flex", gap: 1 }}
          >
            <AccountCircleOutlined fontSize="medium" />
            <Typography sx={{ color: "#333" }}>{user?.username}</Typography>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => {
              navigate("/profile");
              setAnchorEl(null);
            }}>
              <ListItemIcon>
                <AccountCircleOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              logOutHandler();
              setAnchorEl(null);
            }}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
