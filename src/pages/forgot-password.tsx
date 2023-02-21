import LockResetIcon from '@mui/icons-material/LockReset';
import { Avatar, Box, Button, Container, CssBaseline, Grid, Link, TextField, Typography } from "@mui/material";
import NextLink from 'next/link';
import { useState } from 'react';

export default function ForgotPassword() {
  const [finished, setFinished] = useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const magicLinkSenderResponse = await fetch('/api/auth/sendMagicLink', {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(data.entries()))
    });
    if (!magicLinkSenderResponse.ok) {
      const res = await magicLinkSenderResponse.json()
      console.error(res.message);
      return;
    }

    setFinished(true);
  };

  if (finished) return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockResetIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Forgot password
      </Typography>
      <Typography component="p">Thank you! If the email provided exists. You will receive an email shortly.</Typography>
      <Link component={NextLink} href="/" variant="body2">
        {"Return to Sign In"}
      </Link>
    </Box>
  )

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockResetIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot password
        </Typography>
        <Typography component="p">Enter the email associated with your account and if the email is in our records we will send you a magic link.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            type="email"
            margin="normal"
            required
            fullWidth
            id="email"
            label="email"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Send Recovery Link
          </Button>
          <Grid container>
            <Grid item>
              <Link component={NextLink} href="/" variant="body2">
                {"Return to Sign In"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}