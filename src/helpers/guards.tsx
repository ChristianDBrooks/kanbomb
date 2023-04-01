import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

/** Current Guard Flow 
 * No User (session)        -->   /sign-in
 * Not Verified (session)   -->   /not-verified
*/

/** If no callback is provided returns empty props object */
export async function withAuthenticationGuard(
  ctx: GetServerSidePropsContext,
  handler: () => Promise<GetServerSidePropsResult<{ [key: string]: unknown; }>>
): Promise<GetServerSidePropsResult<{ [key: string]: unknown; }>> {
  const user = ctx.req?.session?.user;
  const url = ctx?.resolvedUrl;

  console.log('[guards]: current route being checked:', url);
  if (!user) {
    console.log('[guards]: redirecting to route: /sign-in');
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

  return handler()
}