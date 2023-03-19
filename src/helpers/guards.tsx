import { GetServerSidePropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";

/** Current Guard Flow 
 * No User (session)        -->   /sign-in
 * Not Verified (session)   -->   /not-verified
*/

/** If no callback is provided returns empty props object */
export async function withAuthenticationGuard(
  ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
  ssrWork?: Function
) {
  const user = ctx.req?.session?.user;
  const url = ctx?.resolvedUrl;

  console.log('gaurds: routing -', url);
  if (!user) {
    console.log('guards: redirecting - /sign-in');
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false
      },
    };
  }

  if (!url.endsWith('/not-verified') && !user.verified) {
    console.log('guards: redirecting - /not-verified');
    return {
      redirect: {
        destination: '/not-verified',
        permanent: false
      },
    };
  }

  const ssrWorkReturn = ssrWork && ssrWork();
  return ssrWorkReturn ?? { props: {} };
}