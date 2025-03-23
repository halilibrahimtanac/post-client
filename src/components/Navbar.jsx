import { AppBar, Box, Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import React, { useState } from "react";
import { AccountCircleOutlined, Logout } from "@mui/icons-material"
import { useNavigate } from "react-router-dom";
import { useLogOutMutation } from "../store/user/mutation";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../store/slices/data";
import { constructMediaUrl } from "../lib/utils";

const Navbar = () => {
  const user = useSelector(state => state.data.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogOutMutation();
  const [anchorEl, setAnchorEl] = useState();

  const logOutHandler = async () => {
    try{
      await logout();
      dispatch(logOut());
    }catch(err){
      console.log(err);
    }finally{
      navigate("/login");
    }
    
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
          sx={{ flexGrow: 1, color: "#333", cursor: "pointer" }}
          onClick={() => navigate("/home")}
        >
          MyApp
        </Typography>
        <Box>
          <Button
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ textTransform: 'none', color: "#333", display: "flex", gap: 1 }}
          >
            {user?.profilePicture ? (
              <Box
                component="img"
                src={constructMediaUrl(user.profilePicture)}
                alt={user.username}
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <AccountCircleOutlined fontSize="medium" />
            )}
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
