import { Box, Paper } from "@mui/material";
import { useState } from "react";
import LoginForm from "./Login";
import SignUpForm from "./SignUp";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = (event) => {
    event.preventDefault();
    setIsLogin((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 2,
          width: "300px",
        }}
      >
        {isLogin ? (
          <LoginForm onToggle={toggleForm} />
        ) : (
          <SignUpForm onToggle={toggleForm} />
        )}
      </Paper>
    </Box>
  );
}
