import prisma from "@lib/prisma";
import { sendMagicLinkEmail, sendVerificationEmail } from "@lib/sendgrid";
import { generateMagicLink, generateVerificationLink, withSessionRoute } from "@lib/withSession";
import type { NextApiRequest, NextApiResponse } from "next";

export default withSessionRoute(sendEmailRoute);

async function sendEmailRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Get path in route /auth/sendEmail/{path}
    const path = req.query?.path?.[0];

    /** Magic Link Email*/
    if (path === 'magicLink') {
      await magicLinkController(req, res);
      return;
    }

    /** Verification Email */
    if (path === 'verification') {
      await verificationController(req, res);
      return;
    }

    res.status(404).send(`The path ${req.url} does not exist on the server.`)
    return;
  }
  
  res.status(404).send(`The request method is not supported. Only "POST" requests are supported.`)
}

async function magicLinkController(req: NextApiRequest, res: NextApiResponse) {
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

  // If email does not exist return.
  if (!credential) {
    console.log(`Could not find account with email '${email}'.`)
    res.status(200).send(null);
    return;
  }

  const link = await generateMagicLink(credential.user)
  console.log("Magic Link Generated:", link)
  await sendMagicLinkEmail(email, link)
  res.status(200).send(null);
}

async function verificationController(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.session.user?.userId;

  // Check if credential with email exists in database, if not return null
  const credential = await prisma.credential.findUnique({
    where: {
      userId,
    },
    include: {
      user: true
    }
  });

  // If email does not exist return.
  if (!credential) {
    console.log(`Could not find account with userId '${userId}'.`)
    res.status(200).send(null);
    return;
  }

  const link = await generateVerificationLink(credential.user)
  console.log("Verification Link Generated:", link)
  await sendVerificationEmail(credential.email, link)
  res.status(200).send(null);
}
