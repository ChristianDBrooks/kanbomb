import { Box, colors, List } from "@mui/material";
import { Task as ITask } from '@prisma/client';
import useDebounce from 'src/hooks/useDebounce';
import { BoardResponse } from 'src/pages/api/board';
import requestAddTask from "src/requests/requestAddTask";
import requestDeleteTaskList from "src/requests/requestDeleteTaskList";
import requestUpdateTaskList from 'src/requests/requestUpdateTaskList';
import { KeyedMutator } from 'swr';
import Message, { useMessageProvider } from './Message';
import Task from "./Task";
import TaskListMenu from "./TaskListMenu";

// const listReducer: Reducer<Tasks, TaskListAction> = (state, action) => {
//   switch (action.type) {
//     case "add": {
//       // Copy new state array and push new item to front of array
//       return [{ id: uuid(), ...action.task }, ...state];
//     }
//     case "update": {
//       // Identify index of target item from the id provided.
//       let targetIndex = state.findIndex(i => {
//         return i.id === action.taskId;
//       })
//       // Make sure item still exists, (hasn't been deleted and correct id provided)
//       if (targetIndex < 0) {
//         console.error('Could not find task to update when looking for ' + action.taskId + '.')
//         return state;
//       };
//       // Clone and insert new item data into state array
//       state.splice(targetIndex, 1, // Copy state array
//         {
//           ...state[targetIndex],      // copy old item properties
//           ...action.task              // insert any newly updated item propertes
//         }
//       )
//       return [...state]
//     }
//     case "delete": {
//       return [ // Copy state array
//         ...state.filter(element => element.id !== action.taskId)
//       ];
//     }
//     default:
//       throw Error("Unknown action.")
//   }
// }

function TaskList({
  id,
  title,
  tasks,
  boardId,
  mutate
}: {
  id: string;
  title: string;
  tasks: ITask[];
  boardId: string;
  mutate: KeyedMutator<BoardResponse>;
}) {
  const { debounce } = useDebounce();
  const { showMessage, messageController } = useMessageProvider();

  const handleUpdateTitle = (title: string) => {
    debounce(async () => {
      const updates = {
        title
      }
      await requestUpdateTaskList(id, updates)
      mutate();
    })
  }

  const handleDeleteTaskList = async () => {
    await requestDeleteTaskList(id)
    mutate();
  }

  const handleAddTask = async () => {
    await requestAddTask(id)
    mutate()
  }
  return (
    <Box sx={{
      background: colors.grey[900],
      padding: 2,
      borderRadius: '4px',
      minWidth: 300,
    }}>
      <Message controller={messageController} />
      <TaskListMenu
        title={title}
        handleUpdateTitle={handleUpdateTitle}
        handleDeleteTaskList={handleDeleteTaskList}
        handleAddTask={handleAddTask}
      />
      <List>
        {tasks.map(task => (
          <Task
            key={task.id}
            mutate={mutate}
            {...task}
          />
        ))}
      </List>
    </Box>
  );
}

export default TaskList;