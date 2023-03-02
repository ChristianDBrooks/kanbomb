import SignOut from '@components/SignOut';
import { saveSession, withSessionSsr } from '@lib/ironSession';
import prisma from '@lib/prisma';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import { Alert, AlertColor, Avatar, Box, Button, Container, Snackbar, Typography } from "@mui/material";
import { IronSession } from 'iron-session';
import { useState } from 'react';
import { withAuthenticationGuard } from 'src/helpers/guards';

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps(ctx) {
    return withAuthenticationGuard(ctx, async () => {
      const user = ctx.req.session.user;

      const credential = await prisma.credential.findUnique({
        where: {
          userId: user?.userId
        },
        include: {
          user: true
        }
      })
  
      if (credential && credential.verified) {
        await saveSession(ctx.req.session, {
          userId: credential.userId, 
          username: credential.username, 
          role: credential.user.role,
          email: credential.email,
          verified: credential.verified,
        })
  
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false
          }
        }
      }

      return {
        props: {
          user
        }
      }
    })
  },
);

function NotVerifiedPage({user}: {user: IronSession["user"]}) {
  const [userEmail, setUserEmail] = useState(user?.email || null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');

  const showSnack = (message: string, severity?: AlertColor) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity || 'success');
    setOpenSnackbar(true);
  }
  
  const handleResend = async () => {
    const response = await fetch("/api/auth/sendEmail/verification", {
      method: "POST"
    })
    if (response.ok) {
      showSnack('Successfuly sent verification email.')
    } else {
      showSnack('Failed to send verification email.', 'error')
    }
  }

  const handleUpdateEmail = async () => {
    const newEmail = prompt('What would you like to change your email to?');
    if (!newEmail) return;
    const response = await fetch(`/api/user/${user?.userId}`, {
      method: "PUT",
      body: JSON.stringify({
        email: newEmail
      })
    })
    const result = await response.json();
    if (!response.ok) {
      console.error('Something went wrong while updating email. ' + response.status + ' ' + response.statusText);
      showSnack(`Failed to update email address. ${result}`, 'error')
      return;
    }
    setUserEmail(newEmail);
    showSnack(`Successfully updated email address.`)
  }
  return (
  <Container 
    maxWidth="xs" 
    sx={{
      display: 'flex' ,
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <Box
      sx={{
        marginTop: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Avatar sx={{ mx: 'auto', my: 4, bgcolor: 'secondary.main' }}>
        <MarkEmailUnreadIcon />
      </Avatar>
      <Typography>
        We&apos;ve sent a verification email to:
      </Typography>
      <Typography variant='h6' my={2}>{userEmail}</Typography>
      <Typography>
        You will need to verify your email before you can login to your account.
      </Typography>
      <Box 
        sx={{
          mt: 3,
          display: 'flex',
          alignItmes: 'center',
          gap: 1,
          width: '100%',
          flexDirection: 'column'
        }}
      >
        <Typography>{"Don't see an email?"}</Typography>
        <Button 
          variant='contained' 
          onClick={handleResend}
          fullWidth={true}
        >
          Resend Verification Email
        </Button>
        <Button 
          variant='contained' 
          onClick={handleUpdateEmail}
          fullWidth={true}
        >
          Update Email
        </Button>
        <SignOut /> 
      </Box>
    </Box>
    <Snackbar 
      open={openSnackbar}
      onClose={() => setOpenSnackbar(false)}
      autoHideDuration={5000}
    >
      <Alert severity={snackbarSeverity} sx={{width: '100%'}}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
  </Container>)
}

export default NotVerifiedPage;