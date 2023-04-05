import { withSessionRoute } from "@lib/ironSession";
import prisma from "@lib/prisma";
import { Board, Task, TaskList } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getBoardsByUserId, handleDatabaseError } from "src/helpers/database";

export type BoardsWithTaskListsWithTasks = (Board & {
  taskLists: (TaskList & {
    tasks: Task[];
  })[];
})[]

export type BoardResponse = {
  data: {
    boards: BoardsWithTaskListsWithTasks
  },
  message?: string;
}

export default withSessionRoute(userRoute)

async function userRoute(req: NextApiRequest, res: NextApiResponse) {
  if (!req?.session?.user?.userId) {
    const boardResponse: BoardResponse = {
      data: {
        boards: []
      },
      message: 'Not Authorized.'
    }
    res.status(401).json(boardResponse)
    return;
  };
  const userId = req.session.user.userId;
  if (req.method === "GET") {
    try {
      const userBoards = await getBoardsByUserId(userId)
      res.json({
        data: {
          boards: userBoards
        }
      })
    } catch (err) {
      console.error(err)
      handleDatabaseError(err, res)
      res.status(500).send('Internal Server Error');
    }
  } else if (req.method === "POST") {
    try {
      const newBoard = await prisma.board.create({
        data: {
          title: 'New Board',
          userId,
          taskLists: {
            create: [
              {
                title: 'New Board',
                tasks: {
                  create: [
                    {
                      complete: false,
                      text: '',
                    }
                  ]
                }
              }
            ]
          }
        }
      })
      if (!newBoard) {
        throw Error('Could not create new board.')
      }
      const userBoards = await getBoardsByUserId(userId)
      res.json({
        data: {
          boards: userBoards
        }
      })
    } catch (err) {
      console.error(err)
      handleDatabaseError(err, res)
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(400).send('Method not supported.');
  }
}