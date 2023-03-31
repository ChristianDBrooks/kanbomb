import Loading from '@components/Loading'
import Message, { useMessageProvider } from '@components/Message'
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
import { FormEvent, useState } from 'react'

interface SignInElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  username: HTMLInputElement;
  password: HTMLInputElement;
}

interface SignInFormElement extends HTMLFormElement {
  readonly elements: SignInElements;
}

export default function SignUpPage() {
  const route = useRouter();
  const [loading, setLoading] = useState(false)
  const [usernameErrorText, setUsernameErrorText] = useState('')
  const [emailErrorText, setEmailErrorText] = useState('')
  const [passwordErrorText, setPasswordErrorText] = useState('')
  const { showMessage, messageController } = useMessageProvider();

  const clearFormErrors = () => {
    setUsernameErrorText('');
    setEmailErrorText('');
    setPasswordErrorText('');
  }

  const validatePassword = (value?: string) => {
    if (!value) return 'Password is required.'
    if (value.length < 8) return 'Password must be at least 8 characters.'
    if (value.search(/[A-Z]/) === -1) return 'Password must have at least 1 capital letter.'
  }

  const handleSubmit = async (event: FormEvent<SignInFormElement>) => {
    clearFormErrors();
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const { email, username, password } = event.currentTarget.elements;

    const validationError = validatePassword(password.value);

    if (validationError) {
      setPasswordErrorText(validationError);
      return;
    }

    setLoading(true);
    const creationResponse = await fetch('/api/auth/create', {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(data.entries()))
    });

    if (!creationResponse.ok) {
      const text = await creationResponse.text() || 'Something went wrong.'

      if (creationResponse.status === 409) {
        const lcText = text.toLocaleLowerCase();
        if (lcText.includes('username')) {
          setUsernameErrorText(text);
        }
        if (lcText.includes('email')) {
          setEmailErrorText(text);
        }
        setLoading(false);
        return;
      }

      console.error(creationResponse.status + ' ' + creationResponse.statusText);
      showMessage(text, 'error')
      setLoading(false);
      return;
    }

    setLoading(false);
    showMessage("Account creation successful! You are signed in!", 'success')
    route.push('/')
  };

  return (
    <Container component="main" maxWidth="xs">
      <Message controller={messageController} />
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
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            error={!!emailErrorText}
            helperText={emailErrorText}
            onChange={() => setEmailErrorText('')}
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
          <TextField
            error={!!usernameErrorText}
            helperText={usernameErrorText}
            onChange={() => setUsernameErrorText('')}
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            error={!!passwordErrorText}
            helperText={passwordErrorText}
            onChange={() => setPasswordErrorText('')}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item>
              <Link component={NextLink} href="/sign-in" variant="body2">
                {"Already have an account? Sign In"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}