import { withSessionRoute } from "@lib/ironSession";
import prisma from "@lib/prisma";
import { Task } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from "next";
import { getBoardsByUserId, handleDatabaseError } from "src/helpers/database";

export default withSessionRoute(userRoute)

async function userRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = req.session.user?.userId;
    if (!userId) {
      res.status(401).send("Not authorized.");
      return;
    }
    const body = req.body;
    /** CREATE */
    if (req.method === "POST") {
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
    }
    /** UPDATE */
    if (req.method === "PATCH") {
      console.log('taskList:', body.taskList)

      const { tasks, id, title } = body.taskList;

      const titleUpdate = await prisma.taskList.update({
        where: {
          id
        },
        data: {
          title
        }
      })

      if (!titleUpdate) {
        throw new Error("Failed to update task list.")
      }

      const responses = await prisma.$transaction(
        [
          ...tasks.map((task: Task) => {
            return prisma.task.upsert({
              where: {
                id: task.id
              },
              create: {
                ...task,
                taskListId: id,
              },
              update: {
                text: task.text,
                complete: task.complete,
              }
            })
          }),
          prisma.taskList.findUnique({
            where: {
              id
            },
            include: {
              tasks: true
            }
          })
        ]
      )

      if (responses.some((response) => !response)) {
        throw new Error("Failed to update task list.")
      }

      const taskList = responses[responses.length - 1]

      console.log('updated taskList:', taskList);

      res.json({
        data: {
          taskList
        }
      })
    }
    /** DELETE */
    if (req.method === "DELETE") {
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


    }
  } catch (err) {
    console.error(err)
    handleDatabaseError(err, res)
    res.status(500).send('Internal Server Error');
  }
}