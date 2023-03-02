import { withSessionRoute } from "@lib/ironSession";
import { NextApiRequest, NextApiResponse } from "next";

export default withSessionRoute(getSession);

async function getSession(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(404).send('/api/auth/session only accepts GET requests.')
  }
  if ("session" in req) {
    res.json(req.session);
  } else {
    res.status(200).send("Could not find session.")
  }
}
