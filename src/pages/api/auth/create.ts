import { generateVerificationLink, saveSession, withSessionRoute } from "@lib/ironSession";
import prisma from "@lib/prisma";
import { sendVerificationEmail } from "@lib/sendgrid";
import bcrypt from "bcrypt";
import type { NextApiRequest, NextApiResponse } from "next";

export default withSessionRoute(createCredentialRoute);

async function createCredentialRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("DATABASE_URL:", process.env.DATABASE_URL ?? 'undefined')
  if (req.method === "POST") {
    const { username, password, email } = req.body;

    // Validate username and password
    if (!username || !password || !email) {
      res.status(400).send("You must provide username, email, and password!");
      return;
    }

    // Check if credential with username exists in database, if not return null
    const usernameExists = await prisma.credential.findUnique({
      where: {
        username,
      },
    });

    // Check if credential with email exists in database, if not return null
    const emailExists = await prisma.credential.findUnique({
      where: {
        email,
      },
    });

    // If username or email already exist return error.
    if (emailExists) {
      res.status(409).send("Email already exists.");
      return;
    }

    // If username or email already exist return error.
    if (usernameExists) {
      res.status(409).send("Username already exists.");
      return;
    }

    // Create new hash
    bcrypt.hash(password, 10, async (err, hash) => {
      // Return if error
      if (err) {
        res.status(500).json({ error: err });
        return;
      }

      // Now we can store the password hash in credential db and create associated user
      const credential = await prisma.credential.create({
        data: {
          username,
          email,
          hash,
          user: {
            create: {
              role: 'USER',
            }
          }
        },
        include: {
          user: true
        }
      });

      if (credential) await saveSession(req.session, {
        userId: credential.userId,
        username: credential.username,
        role: credential.user.role,
        email: credential.email,
        verified: credential.verified,
      });

      // send verification email
      const link = await generateVerificationLink(credential.user)
      console.log("Verification Link Generated:", link)
      await sendVerificationEmail(credential.email, link)

      res.status(200).send(null);
    });
  }
}
