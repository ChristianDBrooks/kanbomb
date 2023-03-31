import { saveSession, withSessionRoute } from "@lib/ironSession";
import prisma from "@lib/prisma";
import { Credential, User } from "@prisma/client";
import bcrypt from "bcrypt";
import type { NextApiRequest, NextApiResponse } from "next";
import { handleDatabaseError } from "src/helpers/database";


export default withSessionRoute(authenticateCredentialRoute);

async function authenticateCredentialRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).send("You must provide username and password!");
      return;
    }

    let credential!: (Credential & { user: User; }) | null;
    // Check if credential with username exists in database, if not return null
    try {
      credential = await prisma.credential.findUnique({
        where: {
          username,
        },
        include: {
          user: true
        }
      });
    } catch (error) {
      handleDatabaseError(error, res)
      return;
    }

    // If credential could not be found return error
    if (!credential) {
      console.log("Unable to find username " + username);
      res.status(404).send("Username or password does not exist.");
      return;
    }

    // Compare plain text password against stored hash
    bcrypt.compare(password, credential.hash, async (err, result) => {
      // Return 500 if error
      if (err) {
        console.error("error comparing hashes");
        res.status(500).json(err);
        return;
      }

      // If they match return create a session
      if (result) {
        if (credential) await saveSession(req.session, {
          userId: credential.userId,
          username: credential.username,
          role: credential.user.role,
          email: credential.email,
          verified: credential.verified,
        });
        res.status(200).send('Credentials authenticated!');
        return;
      }

      // Not Authenticated
      res.status(404).send("Username or password does not exist.");
    });
  } else {
    res.status(400).send("Request method " + req.method + " not supported.");
  }
}
