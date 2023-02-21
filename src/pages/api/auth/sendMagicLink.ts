import prisma from "@lib/prisma";
import { sendMagicLinkEmail } from "@lib/sendgrid";
import { generateMagicLink } from "@lib/withSession";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function createCredentialRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email } = req.body;

    // Validate username and password
    if (!email) {
      res.status(400).json("You must provide email!");
      return;
    }

    // Check if credential with email exists in database, if not return null
    const credential = await prisma.credential.findUnique({
      where: {
        email,
      },
      include: {
        user: true
      }
    });
    
    // If username or email already exist return error.
    if (credential) {
      const link = await generateMagicLink(credential.user)
      console.log("Magic Link Generated:", link)
      await sendMagicLinkEmail(email, link)
    }

    res.status(200).send(null);
  }
}
