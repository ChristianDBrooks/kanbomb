import Loading from '@components/Loading';
import Message, { useMessageProvider } from '@components/Message';
import SignOut from '@components/SignOut';
import { saveSession, withSessionSsr } from '@lib/ironSession';
import prisma from '@lib/prisma';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import { Avatar, Box, Button, Container, Typography } from "@mui/material";
import { IronSession } from 'iron-session';
import { useState } from 'react';
import { withAuthenticationGuard } from 'src/helpers/guards';

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps(ctx) {
    try {
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
              destination: '/',
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
    } catch (err) {
      console.error(err)
      return {
        props: {
          user: undefined
        }
      }
    }
  },
);

function NotVerifiedPage({ user }: { user: IronSession["user"] }) {
  const [userEmail, setUserEmail] = useState(user?.email || null);
  const [loading, setLoading] = useState(false);
  const { showMessage, messageController } = useMessageProvider();

  const handleResend = async () => {
    setLoading(true);
    const response = await fetch("/api/auth/sendEmail/verification", {
      method: "POST"
    })
    if (response.ok) {
      showMessage('Successfuly sent verification email.', 'success')
    } else {
      showMessage('Failed to send verification email.', 'error')
    }
    setLoading(false);
  }

  const handleUpdateEmail = async () => {
    // TODO: Make this a form in a dialog instead of a prompt.
    const newEmail = prompt('What would you like to change your email to?');
    if (!newEmail) return;

    setLoading(true);
    const response = await fetch(`/api/user/${user?.userId}`, {
      method: "PUT",
      body: JSON.stringify({
        email: newEmail
      })
    })

    const result = await response.text();
    if (!response.ok) {
      console.error(`Failed to update email address. ${result}`, 'error');
      setLoading(false);
      showMessage(`Failed to update email address. ${result}`, 'error')
      return;
    }

    setUserEmail(newEmail);
    setLoading(false);
    showMessage(`Successfully updated email address.`, 'success')
  }

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Loading open={loading} />
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
      <Message controller={messageController} />
    </Container>)
}

export default NotVerifiedPage;