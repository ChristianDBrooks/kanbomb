import { withSessionSsr } from "@lib/ironSession";
import { Container, List, ListItem, Typography } from "@mui/material";
import { IronSessionData } from "iron-session";
import { withAuthenticationGuard } from "src/helpers/guards";

export const getServerSideProps = withSessionSsr(
  function getServerSideProps(ctx) {
    return withAuthenticationGuard(ctx, () => {
      return {
        props: {
          user: ctx.req.session.user
        }
      }
    });
  },
);

export default function dashboardPage({ user }: { user: IronSessionData["user"] }) {
  return (<>
    <div style={{
      backgroundImage: 'url(background.jpg)',
      backgroundPosition: 'center',
      WebkitBackgroundSize: 'cover',
      backgroundSize: 'cover',
      WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0))",
      maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0))"
    }}
    >
      <Container 
        maxWidth="lg" 
        sx={{
          minHeight: [300, 400], 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center'
        }}
      >
        <Typography 
          component="h1" 
          variant="h2" 
          sx={{
            fontWeight: 700,
            textAlign: 'left',
            maxWidth: 500
          }}
        >
          Welcome to NextJS Starter
        </Typography>
      </Container>
    </div>
    <Container sx={{marginTop: 6}}>
      <Typography variant="h5">What is NextJS Starter?</Typography>
      <Typography>NextJS Starter is a batteries included framework with many fundamental features already included that a full stack web application will require.</Typography>
    </Container>
    <Container sx={{marginTop: 4}}>
      <Typography variant="h5">NextJS Feature List</Typography>
      <List>
        <ListItem>NextJS</ListItem>
        <ListItem>Authentication</ListItem>
        <ListItem>User Sessions</ListItem>
        <ListItem>Prisma with PostgreSQL</ListItem>
        <ListItem>Material UI</ListItem>
        <ListItem>Email API {'(SendGrid)'}</ListItem>
        <ListItem>Payment API {'(Stripe)'}</ListItem>
      </List>
    </Container>
  </>
  )
}