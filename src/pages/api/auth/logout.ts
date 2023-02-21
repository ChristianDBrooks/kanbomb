import { withSessionRoute } from "@lib/withSession";
import type { NextApiRequest, NextApiResponse } from "next";


export default withSessionRoute(sessionLogout);

async function sessionLogout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    req.session.destroy();
    res.redirect('/')
  } else {
    res.status(400).send("Request method " + req.method + " not supported.");
  }
}
