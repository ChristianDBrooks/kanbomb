import SignOut from '@components/SignOut';
import prisma from '@lib/prisma';
import { saveSession, withSessionSsr } from '@lib/withSession';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import { Avatar, Box, Button, Container, Typography } from "@mui/material";
import { IronSession } from 'iron-session';
import { withAuthenticationGuard } from 'src/helpers/guards';

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    return withAuthenticationGuard(req, async () => {
      const user = req.session.user;

      const credential = await prisma.credential.findUnique({
        where: {
          userId: user?.userId
        },
        include: {
          user: true
        }
      })
  
      if (credential && credential.verified) {
        await saveSession(req.session, {
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

function notVerifiedPage({user}: {user: IronSession["user"]}) {
  const handleResend = async () => {
    const response = await fetch("/api/auth/sendEmail/verification", {
      method: "POST"
    })
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
      <Typography variant='h6' my={2}>{user!.email}</Typography>
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
        <SignOut /> 
      </Box>
    </Box>
  </Container>)
}

export default notVerifiedPage;