import { Container, List, ListItem, Typography } from "@mui/material";

export default function Home() {
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
          Welcome to Catalyst.
        </Typography>
      </Container>
    </div>
    <Container sx={{ marginTop: 6 }}>
      <Typography variant="h5">What is Catalyst?</Typography>
      <Typography>Catalyst is a batteries included applciation starter kit built on NextJS with many fundamental features already included that a full stack web application will require.</Typography>
    </Container>
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h5">Catalyst Feature List</Typography>
      <List>
        <ListItem>NextJS</ListItem>
        <ListItem>Authentication</ListItem>
        <ListItem>User Sessions</ListItem>
        <ListItem>Prisma with PostgreSQL</ListItem>
        <ListItem>Material UI</ListItem>
        <ListItem>Email API {'(SendGrid)'}</ListItem>
        <ListItem>Payment API {'(Stripe)'}</ListItem>
        <ListItem>Progressive Web App {'(Stripe)'}</ListItem>
      </List>
    </Container>
  </>
  )
}