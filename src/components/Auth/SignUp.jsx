import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useSignupMutation } from "../../store/user/mutation";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/data";

export default function SignUpForm({ onToggle }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", username: "", password: "", confirmPassword: "" });
  const [signup] = useSignupMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if(Object.values(form).some(v => !v)) {
      alert("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (form.username.length < 3) {
      alert("Username must be at least 3 characters long");
      return;
    }

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const result = await await signup({
        email: form.email,
        username: form.username,
        password: form.password,
        userType: "regular"
      }).unwrap();
      
      dispatch(setCredentials(result));
      
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const onChangeField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  return (
    <>
      <Typography variant="h5" component="h1" align="center" gutterBottom>
        Sign Up
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="signup-email"
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
          id="signup-username"
          label="Username"
          name="username"
          autoComplete="username"
          onChange={(e) => onChangeField("username", e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="signup-password"
          autoComplete="new-password"
          onChange={(e) => onChangeField("password", e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="signup-confirmPassword"
          autoComplete="new-password"
          onChange={(e) => onChangeField("confirmPassword", e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
          Sign Up
        </Button>
      </Box>
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2">
          Already have an account?{" "}
          <Link href="#" onClick={(e) => onToggle(e, "/login")}>
            Sign In
          </Link>
        </Typography>
      </Box>
    </>
  );
}
