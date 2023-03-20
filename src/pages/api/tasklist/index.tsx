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
      console.log('taskListId:', body.taskListId)
      console.log('tasks:', body.tasks)

      const responses = await prisma.$transaction(
        [
          ...body.tasks.map((task: Task) => {
            return prisma.task.upsert({
              where: {
                id: task.id
              },
              create: {
                ...task,
                taskListId: body.taskListId,
              },
              update: {
                text: task.text,
                complete: task.complete,
              }
            })
          }),
          prisma.taskList.findUnique({
            where: {
              id: body.taskListId
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

      console.log('saved tasks:', taskList.tasks);

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