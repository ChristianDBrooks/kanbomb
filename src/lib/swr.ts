import { IronSessionData } from 'iron-session';
import useSWR from 'swr';
//@ts-ignore
const fetcher = (...args: any) => fetch(...args).then(res => res.json())

type UseIronSessionProps = { session: IronSessionData, isLoading: boolean, isError: any };

export function useIronSession() {
  const { data, error, isLoading } = useSWR(`/api/auth/session`, fetcher)

  return {
    session: data,
    isLoading,
    isError: error
  } as UseIronSessionProps
}