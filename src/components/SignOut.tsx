import { Button } from "@mui/material";

export default function SignOut() {
  return (
    <form method="GET" action="/api/auth/signout">
      <Button variant="contained" type="submit" fullWidth={true}>Sign Out</Button>
    </form>
  )
}