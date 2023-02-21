
// This is the typing for the req.session object
declare module "iron-session" {
  export interface IronSessionData {
    user?: {
      userId: string;
      username: string;
      role?: "ADMIN" | "USER";
    };
  }
}

import { User } from "@prisma/client";
import { IronSession, IronSessionData, sealData } from "iron-session";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler
} from "next";

const sessionOptions = {
  password: process.env.IRON_SESSION_PASSWORD!,
  cookieName: "next_starter_iron_session",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

// Theses types are compatible with InferGetStaticPropsType https://nextjs.org/docs/basic-features/data-fetching#typescript-use-getstaticprops
export function withSessionSsr<
  P extends { [key: string]: unknown } = { [key: string]: unknown },
>(
  handler: (
    context: GetServerSidePropsContext,
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
  return withIronSessionSsr(handler, sessionOptions);
}

export async function saveSession(session: IronSession, user: IronSessionData["user"]) {
  if (!session) return;
  session.user = user
  await session.save()
}

export async function generateMagicLink(user: User) {
  const host = location.protocol + '//' + location.host;
  const fifteenMinutesInSeconds = 15 * 60;
  const seal = await sealData(
    {
      userId: user.id,
    },
    {
      password: process.env.IRON_SESSION_PASSWORD!,
      ttl: fifteenMinutesInSeconds
    },
  );
  return `${host}/api/auth/magicLogin?seal=${seal}`
}