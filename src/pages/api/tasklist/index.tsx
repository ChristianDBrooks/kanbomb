import { withSessionRoute } from "@lib/ironSession";
import prisma from "@lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getBoardsByUserId, handleDatabaseError } from "src/helpers/database";

export default withSessionRoute(userRoute)

async function userRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const userId = req.session.user?.userId;
      if (!userId) {
        res.status(401).send("Not authorized.");
        return;
      }
      const body = req.body;
      const taskList = await prisma.taskList.create({
        data: {
          title: 'New Task List',
          boardId: body.boardId,
          tasks: {
            create: [
              {
                complete: false,
                text: '',
              }
            ]
          }
        }
      })
      if (!taskList) {
        throw Error('Could not create new task list.')
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
  }
  if (req.method === "DELETE") {
    try {
      const userId = req.session.user?.userId;
      if (!userId) {
        res.status(401).send("Not authorized.");
        return;
      }
      const body = req.body;
      const taskList = await prisma.taskList.delete({
        where: {
          id: body.taskListId
        }
      })
      if (!taskList) {
        throw Error('Could not create new task list.')
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
  }
}