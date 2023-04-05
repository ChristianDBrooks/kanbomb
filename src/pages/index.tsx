import Board from "@components/Board";
import Message, { useMessageProvider } from "@components/Message";
import { fetcher } from "@lib/swr";
import { Button, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useSession from "src/hooks/useSession";
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { BoardResponse, BoardsWithTaskListsWithTasks } from "./api/board";

// export const getServerSideProps = withSessionSsr(
//   async function getServerSideProps(ctx) {
//     try {
//       return await withAuthenticationGuard(ctx, async () => {
//         const boards = await prisma.board.findMany({
//           where: {
//             userId: ctx.req.session.user?.userId
//           },
//           include: {
//             taskLists: {
//               include: {
//                 tasks: true
//               }
//             }
//           }
//         })

//         return {
//           props: {
//             boards: boards ?? []
//           }
//         }
//       })
//     } catch (err) {
//       console.error(err)
//       return {
//         props: {
//           boards: []
//         }
//       }
//     }
//   }
// )

export default function DashboardPage() {
  const session = useSession();
  const { data: response, isLoading, error, mutate } = useSWR<BoardResponse>('/api/board', fetcher);
  const [boards, setBoards] = useState<BoardsWithTaskListsWithTasks | undefined>(undefined);
  const [activeBoardId, setActiveBoardId] = useState<string | undefined>(undefined)
  const activeBoard = response?.data?.boards?.find((board) => board.id === activeBoardId)
  const { showMessage, messageController } = useMessageProvider();

  useEffect(() => {
    if (response) {
      setBoards(response.data.boards)
      setActiveBoardId(prev => prev ?? response.data.boards[0].id)
    }
  }, [response])

  const handleAddNewBoard = async (url: string) => {
    await fetch(url, {
      method: 'POST'
    })
  }

  const { trigger: newBoard } = useSWRMutation('/api/board', handleAddNewBoard)

  if (isLoading) {
    return <Container sx={{
      padding: 2,
      minHeight: 'calc(100vh - 64px)'
    }}>
      <Typography>
        Loading board...
      </Typography>
    </Container>
  }

  if (!activeBoard) {
    return (
      <Container sx={{
        padding: 2,
        minHeight: 'calc(100vh - 64px)'
      }}>
        <Typography>
          {session?.data?.user?.username}, you have no boards. Create one!
        </Typography>
        <Button onClick={() => {
          newBoard();
        }}>Create New Board</Button>
      </Container>
    )
  }

  return (
    <Container sx={{
      minHeight: 'calc(100vh - 64px)',
    }}>
      <Message controller={messageController} />
      <Board
        id={activeBoard.id}
        title={activeBoard.title}
        taskLists={activeBoard.taskLists}
        mutate={mutate}
      />
    </Container>
  )
}