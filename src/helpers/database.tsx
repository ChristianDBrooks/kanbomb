import prisma from "@lib/prisma";
import { Prisma } from "@prisma/client";
import { NextApiResponse } from "next";

export function handleDatabaseError(error: any, res: NextApiResponse, map?: { [key: string]: Function }) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`Database error occured: ${error.code} ${error.cause} ${error.message}`);
    if (map && error.code) {
      map[error.code]();
    } else {
      res.status(500).send(`Database error occured: ${error.cause} ${error.message}`);
    }
  }
}

export function getBoardsByUserId(userId: string) {
  return prisma.board.findMany({
    where: {
      userId
    },
    include: {
      taskLists: {
        include: {
          tasks: true
        }
      }
    }
  })
}