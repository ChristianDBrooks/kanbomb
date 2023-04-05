import { fetcher } from "@lib/swr";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SessionResponse } from "src/pages/api/auth/session";
import useSWR from 'swr';

export default function useSession(redirectTo = "/sign-in") {
  const { data: session, isLoading, error } = useSWR<SessionResponse>('/api/auth/session', fetcher);
  const router = useRouter();

  useEffect(() => {
    if (!session && !isLoading || error) {
      router.push(redirectTo)
      return;
    }
  }, [session, isLoading, error, redirectTo, router])

  return session;
}