
import { saveSession, withSessionRoute } from "@lib/ironSession";
import prisma from "@lib/prisma";
import { unsealData } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import { handleDatabaseError } from "src/helpers/database";

export default withSessionRoute(verifyRoute);

async function verifyRoute(req: NextApiRequest, res: NextApiResponse) {
  if (typeof req.query.seal == 'string') {
    const { userId }: { userId: string } = await unsealData(req.query.seal, {
      password: process.env.IRON_SESSION_PASSWORD!,
    });

    // If link has expired return to sign in.
    if (!userId) {
      res.redirect('/404') // TODO: Make a dedicated expiration page.
    }

    const credential = await prisma.credential.update({
      where: {
        userId
      },
      data: {
        verified: true
      },
      include: {
        user: true
      }
    })

    if (credential) {
      await saveSession(req.session, {
        userId: userId,
        username: credential.username,
        role: credential.user.role,
        verificationSession: true,
        email: credential.email,
        verified: credential.verified,
      })

      try {

        const boardWithUser = await prisma.board.create({
          data: {
            userId: credential.user.id,
            title: 'New Board',
            taskLists: {
              create: {
                title: 'New TaskList',
                tasks: {
                  create:
                    [
                      {
                        text: 'Something to do.'
                      },
                      {
                        text: 'Something already done!',
                        complete: true
                      },
                    ]
                }
              }
            }
          }
        })
      } catch (error) {
        handleDatabaseError(error, res)
      }

      res.redirect(`/verified`);
    }

  } else {
    res.status(400).send("Unexpected query param.");
  }
}
