
import prisma from "@lib/prisma";
import { saveSession, withSessionRoute } from "@lib/withSession";
import { unsealData } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";

export default withSessionRoute(magicLoginRoute);

async function magicLoginRoute(req: NextApiRequest, res: NextApiResponse) {
  if (typeof req.query.seal == 'string') {
    const { userId }: { userId: string } = await unsealData(req.query.seal, {
      password: process.env.IRON_SESSION_PASSWORD!,
    });

    // If link has expired return to sign in.
    if (!userId) {
      res.redirect('/404') // TODO: Make a dedicated expiration page.
    }

    const credential = await prisma.credential.findUnique({
      where: {
        userId
      },
      include: {
        user: true
      }
    })

    if (credential) {
      await saveSession(req.session, {
        userId: userId, 
        username: credential.username, 
        role: credential.user.role
      })
      res.redirect(`/dashboard`);
    }
    
  } else {
    res.status(400).send("Unexpected query param.");
  }
}
