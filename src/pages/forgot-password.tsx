import ControlledMessage, { useMessageController } from '@components/ControlledMessage';
import Loading from '@components/Loading';
import LockResetIcon from '@mui/icons-material/LockReset';
import { Avatar, Box, Button, Container, CssBaseline, Grid, Link, TextField, Typography } from "@mui/material";
import NextLink from 'next/link';
import { FormEvent, useState } from 'react';

interface ForgotPasswordFormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement
}

interface ForgotPasswordFormElement extends HTMLFormElement {
  readonly elements: ForgotPasswordFormElements
}

export default function ForgotPassword() {
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const { controller, message } = useMessageController();

  const handleSubmit = async (event: FormEvent<ForgotPasswordFormElement>) => {
    setLoading(true);

    event.preventDefault();
    const email = event.currentTarget.elements.email.value;

    const magicLinkSenderResponse = await fetch('/api/auth/sendEmail/magicLink', {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        email
      })
    });

    if (!magicLinkSenderResponse.ok) {
      const text = await magicLinkSenderResponse.text();
      const errorMsg = text || 'Something went wrong.';
      console.error(errorMsg);
      setLoading(false);
      message(errorMsg, 'error');
      return;
    }

    setLoading(false);
    setFinished(true);
  };

  return (
    <Container component="main" maxWidth="xs">
      <ControlledMessage controller={controller} />
      <Loading open={loading} />
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
        <Typography component="h1" variant="h5" mb={3}>
          Forgot password
        </Typography>
        {finished ? (
          <Typography component="p">Thank you! If the provided email matches an email we have on file, you will receive an email shortly.</Typography>
        ) : (
          <>
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
            </Box>
          </>
        )}
        <Grid container>
          <Grid item>
            <Link component={NextLink} href="/sign-in" variant="body2">
              {"Return to Sign In"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}