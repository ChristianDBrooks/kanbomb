import { withSessionRoute } from "@lib/ironSession";
import { IronSessionData } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";

export type SessionResponse = {
  data?: IronSessionData;
  message?: string;
}

export default withSessionRoute(getSession);

async function getSession(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(404).json({
      message: '/api/auth/session only accepts GET requests.'
    })
  }
  if ("session" in req) {
    res.json({
      data: req.session,
    });
  } else {
    res.status(200).json({
      message: "Could not find session."
    })
  }
}
