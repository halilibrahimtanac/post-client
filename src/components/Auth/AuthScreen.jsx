import { Box, Paper } from "@mui/material";
import LoginForm from "./Login";
import SignUpForm from "./SignUp";
import { useNavigate } from "react-router-dom";

export default function AuthScreen({ form = "login" }) {
  const navigate = useNavigate();

  const toggleForm = (event, route) => {
    event.preventDefault();
    navigate(route);
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
        {form === "login" ? (
          <LoginForm onToggle={toggleForm} />
        ) : (
          <SignUpForm onToggle={toggleForm} />
        )}
      </Paper>
    </Box>
  );
}
