import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useLoginMutation } from "../../store/user/mutation";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/data";

export default function LoginForm({ onToggle }) {
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const [formInfos, setFormInfos] = useState({ email: "", password: "" });
  const dispatch = useDispatch();

  const onChangeField = (field, value) => {
    setFormInfos(prev => ({ ...prev, [field]: value }));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(formInfos.email && formInfos.password){
      try {
        const result = await login(formInfos).unwrap();
        
        dispatch(setCredentials(result));
        
        navigate("/home");
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };

  return (
    <>
      <Typography variant="h5" component="h1" align="center" gutterBottom>
        Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="login-email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          onChange={(e) => onChangeField("email", e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="login-password"
          autoComplete="current-password"
          onChange={(e) => onChangeField("password", e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
          Sign In
        </Button>
      </Box>
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2">
          Don't have an account?{" "}
          <Link href="#" onClick={(e) => onToggle(e, "/signup")}>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </>
  );
}
