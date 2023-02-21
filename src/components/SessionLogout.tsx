import { Button } from "@mui/material";

export default function SessionLogout() {
  return (
    <form method="GET" action="/api/auth/logout">
      <Button variant="contained" type="submit">Logout</Button>
    </form>
  )
}