import { withSessionSsr } from "@lib/withSession";
import CheckIcon from "@mui/icons-material/CheckCircle";
import { Avatar, Box, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { withAuthSsr } from "src/helpers/withAuthenticationSsr";

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    return withAuthSsr(req, () => {      
      if (!req.session.user?.verificationSession) {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false
          },
        };
      }
    });
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