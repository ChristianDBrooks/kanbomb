import { IncomingMessage } from "http";

export async function withAuthSsr(req: IncomingMessage & {
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

  return ssrWork ? ssrWork() : { props: {}};
}