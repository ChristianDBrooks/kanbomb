import PageHeader from "@components/PageHeader";
import { withSessionSsr } from "@lib/ironSession";
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
  return (<>
    <Container>
      <PageHeader title="My Profile" />
      <Paper sx={{ p: 2 }}>
        <Box display='flex' alignItems="center" gap={3}>
          <Avatar alt="Profile Picture" sx={{ height: 88, width: 88 }} src="./pfp-small.jpg" />
          <Box display="flex" flexDirection='column'>
            <Typography variant="h5">{user?.username}</Typography>
            <Typography>{user?.email}</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  </>
  )
}