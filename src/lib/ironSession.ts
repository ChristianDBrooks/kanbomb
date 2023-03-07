
// This is the typing for the req.session object
declare module "iron-session" {
  export interface IronSessionData {
    user?: {
      userId: string;
      username: string;
      role?: "ADMIN" | "USER";
      verificationSession?: boolean;
      verified: boolean;
      email: string;
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

const host = process.env.NODE_ENV === "production" ? process.env.VERCEL_URL : process.env.EMAIL_REDIRECT_URI;

export const sessionOptions = {
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
/* Wrapper used for getting session in SSR pages. */
export function withSessionSsr<
  P extends { [key: string]: unknown } = { [key: string]: unknown },
>(
  handler: (
    context: GetServerSidePropsContext,
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
  return withIronSessionSsr(handler, sessionOptions);
}

/* Function used to create a new session or modify an existing session. */
export async function saveSession(session: IronSession, user: IronSessionData["user"]) {
  if (!session) return;
  session.user = user;
  await session.save()
}

/* Function used to generate magic links for the provided user. */
export async function generateMagicLink(user: User) {
  if (!host) console.error("Could not get host for magic link generation.")
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

/* Function used to generate verifcation links for the provided user. */
export async function generateVerificationLink(user: User) {
  if (!host) console.error("Could not get host for verication link generation.")
  const twentyFourHoursInSeconds = 60 * 60 * 24;
  const seal = await sealData(
    {
      userId: user.id,
    },
    {
      password: process.env.IRON_SESSION_PASSWORD!,
      ttl: twentyFourHoursInSeconds
    },
  );
  return `${host}/api/auth/verify?seal=${seal}`
}
