import { withSessionSsr } from "@lib/ironSession";
import CheckIcon from "@mui/icons-material/CheckCircle";
import { Avatar, Box, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { withAuthenticationGuard } from "src/helpers/guards";

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps(ctx) {
    return withAuthenticationGuard(ctx, async () => {
      if (!ctx.req.session.user?.verificationSession) {
        return {
          redirect: {
            destination: '/',
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
      <Avatar sx={{ m: 1, mb: 3, bgcolor: 'secondary.main' }}>
        <CheckIcon />
      </Avatar>
      <Typography component="p">Thanks, your email has been successfully verified!</Typography>
      <Link component={NextLink} href="/" variant="body2">
        {"Go to Dashboard"}
      </Link>
    </Box>
  );
}

export default VerifiedPage;