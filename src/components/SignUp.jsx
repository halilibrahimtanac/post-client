import { Box, Button, Link, TextField, Typography } from "@mui/material";

export default function SignUpForm({ onToggle }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your sign-up logic here
    console.log("Signing up...");
  };

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
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="signup-username"
          label="Username"
          name="username"
          autoComplete="username"
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
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
          Sign Up
        </Button>
      </Box>
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2">
          Already have an account?{" "}
          <Link href="#" onClick={onToggle}>
            Sign In
          </Link>
        </Typography>
      </Box>
    </>
  );
}
