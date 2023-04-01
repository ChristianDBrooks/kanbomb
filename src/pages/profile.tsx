import Loading from "@components/Loading";
import PageHeader from "@components/PageHeader";
import { withSessionSsr } from "@lib/ironSession";
import { useIronSession } from "@lib/swr";
import { Avatar, Box, Container, Paper, Typography } from "@mui/material";
import { IronSessionData } from "iron-session";
import { withAuthenticationGuard } from "src/helpers/guards";

export const getServerSideProps = withSessionSsr(
  function getServerSideProps(ctx) {
    return withAuthenticationGuard(ctx, async () => {
      return {
        props: {
          user: ctx.req.session.user
        }
      }
    });
  },
);

export default function ProfilePage({ user }: { user: IronSessionData["user"] }) {
  const { session, isLoading, isError } = useIronSession();

  if (isError) throw new Error(isError)

  return (<>
    <Container>
      <Loading open={isLoading} />
      <PageHeader title="My Profile" />
      <Paper sx={{ p: 2 }}>
        <Box display='flex' alignItems="center" gap={3}>
          <Avatar alt="Profile Picture" sx={{ height: 88, width: 88 }} src="./pfp-small.jpg" />
          <Box display="flex" flexDirection='column'>
            <Typography variant="h5">{session?.user?.username}</Typography>
            <Typography>{session?.user?.email}</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  </>
  )
}