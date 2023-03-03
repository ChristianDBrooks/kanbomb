import ControlledMessage, { useMessageController } from '@components/ControlledMessage'
import Loading from '@components/Loading'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useState } from 'react'

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(false);
  const route = useRouter()
  const { controller, message } = useMessageController();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const authenticationResponse = await fetch('/api/auth/authenticate', {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(data.entries()))
    });

    const text = await authenticationResponse.text();
    if (!authenticationResponse.ok) {
      setLoading(false);
      message(text, 'error');
      console.error(text);
      return;
    }
    message('Sign in successful!', 'success');
    setLoading(false);
    route.push('/dashboard')
  };

  return (
    <Container component="main" maxWidth="xs">
      <ControlledMessage controller={controller} />
      <Loading open={loading} />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            required
            autoFocus
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgot-password" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={NextLink} href="/sign-up" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}