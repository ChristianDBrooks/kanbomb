import SessionLogout from "@components/SessionLogout";
import { withSessionSsr } from "@lib/withSession";
import { Container, Typography } from "@mui/material";
import { IronSessionData } from "iron-session";

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

    return {
      props: {
        user: req.session.user,
      },
    };
  },
);

export default function dashboardPage({user}: {user: IronSessionData["user"]}) {
  return (
    <Container maxWidth="sm">
      <Typography component="h1" sx={{textAlign: 'center'}}>Welcome to the Dashboard, {user?.username || 'Anon'}</Typography>
      <SessionLogout />
    </Container>
  )
}