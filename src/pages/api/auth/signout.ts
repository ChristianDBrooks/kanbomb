import { withSessionRoute } from "@lib/withSession";
import type { NextApiRequest, NextApiResponse } from "next";


export default withSessionRoute(SignOutRoute);

async function SignOutRoute(
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
