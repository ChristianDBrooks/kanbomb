import { withSessionSsr } from "@lib/ironSession";
import { Container, Typography } from "@mui/material";
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
      backgroundImage: 'url(dashboard.jpg)',
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
          This is The Dashboard.
        </Typography>
        <Typography
          component="h2"
          variant="subtitle1"
        >
          A place where users can do something in the app. It represents the endless possiblities of what can be.
        </Typography>
      </Container>
    </div>
    <Container sx={{ marginTop: 6 }}>
      <Typography>What will you put in the blank canvas?</Typography>
    </Container>
  </>
  )
}