import { IncomingMessage } from "http";

export async function withAuthenticationGuard(req: IncomingMessage & {
  cookies: Partial<{
      [key: string]: string;
  }>;
}, ssrWork?: Function) {
  const user = req.session.user;
  
  if (!user) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false
      },
    };
  }

  if (!user.verified) {
    return {
      redirect: {
        destination: '/not-verified',
        permanent: false
      },
    };
  }

  return ssrWork ? ssrWork() : { props: {}};
}