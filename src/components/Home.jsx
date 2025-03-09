import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";
import { AccountCircleOutlined, Logout } from "@mui/icons-material"
import PostList from "./Post/PostList";
import { useNavigate } from "react-router-dom";
import { useLogOutMutation } from "../store/user/mutation";

const Home = () => {
  const navigate = useNavigate();
  const [logout] = useLogOutMutation();

  const logOutHandler = async () => {
    await logout();
    navigate("/login");
  }

  return (
    <div>
      {" "}
      <AppBar position="static" sx={{ backgroundColor: '#fff', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#333' }}>
            Home Page
          </Typography>
          <IconButton sx={{ color: '#333' }}>
            <AccountCircleOutlined fontSize="large" />
          </IconButton>
          <IconButton sx={{ color: '#333' }} onClick={() => {}}>
            <Logout onClick={logOutHandler}/>
          </IconButton>
        </Toolbar>
      </AppBar>
      <PostList />
    </div>
  );
};

export default Home;
