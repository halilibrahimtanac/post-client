import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useLoginMutation } from "../store/user/mutation";
import { useState } from "react";

export default function LoginForm({ onToggle }) {
  const [login] = useLoginMutation();
  const [formInfos, setFormInfos] = useState({ email: "", password: "" });

  const onChangeField = (field, value) => {
    setFormInfos(prev => ({ ...prev, [field]: value }));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if(formInfos.email && formInfos.password){
      login(formInfos);
    }
    console.log(event);
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
          <Link href="#" onClick={onToggle}>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </>
  );
}
