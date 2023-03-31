import Message, { useMessageProvider } from "@components/Message";
import TaskList from "@components/TaskList";
import { withSessionSsr } from "@lib/ironSession";
import prisma from "@lib/prisma";
import AddIcon from '@mui/icons-material/Add';
import { Box, colors, Container, Stack, Typography } from "@mui/material";
import { Board, Task, TaskList as TaskListModel } from "@prisma/client";
import { useState } from "react";
import { withAuthenticationGuard } from "src/helpers/guards";


type BoardsWithTaskListsWithTasks = (Board & {
  taskLists: (TaskListModel & {
    tasks: Task[];
  })[];
})[]

export const getServerSideProps = withSessionSsr(async (ctx) => {
  return await withAuthenticationGuard(ctx, async () => {
    try {
      const boards = await prisma.board.findMany({
        where: {
          userId: ctx.req.session.user?.userId
        },
        include: {
          taskLists: {
            include: {
              tasks: true
            }
          }
        }
      })

      return {
        props: {
          boards: boards ?? []
        }
      }
    } catch (err) {
      console.error(err)
      return {
        redirect: {
          destination: '/unauthorized',
          permanent: false
        }
      }
    }
  })

})

// export const getServerSideProps = withSessionSsr(
//   function getServerSideProps(ctx) {
//     console.log('[SSR]: loading server side dashboard')
//     return withAuthenticationGuard(ctx, async () => {

//       console.log('[SSR]: Loading DashboardPage')
//       try {
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

//         console.log('finished server side dashboard')

//         return {
//           props: {
//             boards: boards ?? []
//           }
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     });
//   },
// );

export default function DashboardPage({ boards: inititalBoards }: { boards: BoardsWithTaskListsWithTasks }) {
  const [boards, setBoards] = useState(inititalBoards);
  const [activeBoardId, setActiveBoardId] = useState(boards?.[0]?.id)
  const activeBoard = boards?.find((board) => board.id === activeBoardId)
  const { showMessage, messageController } = useMessageProvider();

  const handleAddTaskList = async () => {
    const addTaskListResponse = await fetch('/api/tasklist', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        boardId: activeBoardId
      })
    })

    if (!addTaskListResponse.ok) {
      showMessage('Failed to add task list!', 'error')
      return;
    }

    const result: {
      data: {
        boards: BoardsWithTaskListsWithTasks
      }
    } = await addTaskListResponse.json();
    setBoards(result.data.boards)
  }

  const handleDeleteTaskList = async (id: string) => {
    const deleteTaskListResponse = await fetch('/api/tasklist', {
      method: "DELETE",
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        taskListId: id
      })
    })


    if (!deleteTaskListResponse.ok) {
      showMessage('Failed to delete task list!', 'error')
      return;
    }

    const result: {
      data: {
        boards: BoardsWithTaskListsWithTasks
      }
    } = await deleteTaskListResponse.json();
    setBoards(result.data.boards)
  }

  if (!activeBoard) {
    return (
      <Container sx={{
        padding: 2,
        minHeight: 'calc(100vh - 64px)'
      }}>
        <Typography>
          You have no boards. Create one!
        </Typography>
      </Container>
    )
  }

  return (
    <Container sx={{
      minHeight: 'calc(100vh - 64px)',
    }}>
      <Box overflow='auto'>
        <Message controller={messageController} />
        <Typography
          variant="h4"
          paddingY={2}
        >{activeBoard.title}</Typography>
        <Stack direction="row" gap={2}>
          {
            activeBoard.taskLists.map(taskList => <TaskList
              key={taskList.id}
              data={taskList}
              deleteList={handleDeleteTaskList}
            />)
          }
          <Box
            onClick={() => handleAddTaskList()}
            sx={{
              background: colors.grey[800],
              padding: 2,
              borderRadius: '4px',
              minWidth: 300,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <AddIcon />
            Add new list
          </Box>
        </Stack>
      </Box>
    </Container>
  )
}