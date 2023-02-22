import SessionLogout from '@components/SessionLogout';
import prisma from '@lib/prisma';
import { saveSession, withSessionSsr } from '@lib/withSession';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import { Avatar, Box, Button, Container } from "@mui/material";
import { IronSession } from 'iron-session';

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
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
        user: user,
      },
    };
  },
);

function notVerifiedPage({user}: {user: IronSession["user"]}) {
  const handleResend = async () => {
    const response = await fetch("/api/auth/sendEmail/verification", {
      method: "POST"
    })
  }
  return (
  <Container maxWidth="xs" sx={{background: '#FFF'}}>
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
      <MarkEmailUnreadIcon />
    </Avatar>
    <p>We&apos;ve sent a verification email to {user!.email}. You&apos;ll need to verify your email before you can login to your account. </p>
    <p>{"Don't see an email?"}</p>
    <Button variant='contained' sx={{marginBottom: '1rem'}} onClick={handleResend}>Resend Verification Email</Button>
    <SessionLogout />
    </Box>
  </Container>)
}

export default notVerifiedPage;