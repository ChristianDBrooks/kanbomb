import { getIronSession } from "iron-session/edge";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  // Do not re-import the session options from withSession. Edge will not support this.
  const session = await getIronSession(req, res, {
    password: process.env.IRON_SESSION_PASSWORD!,
    cookieName: "next_starter_iron_session",
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });

  if (!session.user) {
    return NextResponse.redirect(new URL('/', req.url)) // redirect to /unauthorized page
  }
  
  if (!session.user.verified && !req.url.endsWith('/not-verified')) {
    return NextResponse.redirect(new URL('/not-verified', req.url)) // redirect to /unauthorized page
  }

  return res;
};

/* Input all routes that you want to block without a valid session, including API requests. */
export const config = {
  matcher: [
    '/dashboard',
    '/verified',
    '/not-verified',
  ],
};