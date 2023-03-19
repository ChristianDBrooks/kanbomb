import { saveSession, withSessionRoute } from "@lib/ironSession";
import prisma from "@lib/prisma";
import { IronSession } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import { handleDatabaseError } from "src/helpers/database";

export default withSessionRoute(userRoute)

async function userRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    try {
      const { userId } = req.query;
      const patch = JSON.parse(req.body);
      const session: IronSession = req.session;

      // Validate current user or an admin is calling route
      if (userId != session?.user?.userId && session.user?.role !== "ADMIN") {
        res.status(401).send('Unauthorized.');
        return;
      }

      if (typeof userId !== "string") {
        res.status(400).send('Malformed query param: userId. Must be a string');
        return;
      };

      // If email is updated then reset verification status to false.
      const data = { ...patch, verified: !patch.email }

      try {
        const user = await prisma.credential.update({
          where: {
            userId: userId
          },
          data
        })

        if (session.user?.email != user.email) {
          await saveSession(req.session, {
            userId: user.userId,
            username: user.username,
            email: user.email,
            verified: user.verified,
          })
          res.redirect(`/verified`);
        }

        res.status(200).json(user);
      } catch (err) {
        console.error(err);
        handleDatabaseError(err, res, {
          'P2002': () => res.status(409).send(`Email ${patch.email} is already in use.`)
        })
      }
    } catch (err) {
      console.error(err)
      res.status(500).send('Internal Server Error');
    }
  }
}