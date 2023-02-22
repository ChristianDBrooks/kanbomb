import { withSessionSsr } from "@lib/withSession";
import CheckIcon from "@mui/icons-material/CheckCircle";
import { Avatar, Box, Link, Typography } from "@mui/material";
import NextLink from "next/link";

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if (!user) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        },
      };
    }

    if (!user.verificationSession) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false
        },
      };
    }

    return {
      props: {
        user,
      },
    };
  },
);

function VerifiedPage() {
  return ( 
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <CheckIcon />
      </Avatar>
      <Typography component="p">Thanks, your email has been successfully verified!</Typography>
      <Link component={NextLink} href="/dashboard" variant="body2">
        {"Go to Dashboard"}
      </Link>
    </Box>
   );
}

export default VerifiedPage;