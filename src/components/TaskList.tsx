import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Box, Button, Checkbox, colors, IconButton, List, ListItem, Stack, TextField } from "@mui/material";
import { Task, TaskList as TaskListModel } from '@prisma/client';
import { Reducer, useEffect, useReducer, useRef, useState } from 'react';
import theme from 'src/config/theme';
import useDebounce from 'src/hooks/useDebounce';
import { uuid } from 'uuidv4';
import Message, { useMessageProvider } from './Message';

type Tasks = Omit<Task, "taskListId">[]

type TaskListAction = {
  type: 'add',
  task: Omit<Task, "id" | "taskListId">;
} | {
  type: 'update',
  taskId: string;
  task: Partial<Omit<Task, "id" | "taskListId">>;
} | {
  type: 'delete',
  taskId: string;
};

const resize = (element: HTMLTextAreaElement) => {
  element.style.height = "5px";
  element.style.height = (element.scrollHeight) + "px";
}

const listReducer: Reducer<Tasks, TaskListAction> = (state, action) => {
  switch (action.type) {
    case "add": {
      // Copy new state array and push new item to front of array
      return [{ id: uuid(), ...action.task }, ...state];
    }
    case "update": {
      // Identify index of target item from the id provided.
      let targetIndex = state.findIndex(i => {
        return i.id === action.taskId;
      })
      // Make sure item still exists, (hasn't been deleted and correct id provided)
      if (targetIndex < 0) {
        console.error('Could not find task to update when looking for ' + action.taskId + '.')
        return state;
      };
      // Clone and insert new item data into state array
      state.splice(targetIndex, 1, // Copy state array
        {
          ...state[targetIndex],      // copy old item properties
          ...action.task              // insert any newly updated item propertes
        }
      )
      return [...state]
    }
    case "delete": {
      return [ // Copy state array
        ...state.filter(element => element.id !== action.taskId)
      ];
    }
    default:
      throw Error("Unknown action.")
  }
}

function TaskList({
  data,
  deleteList
}: {
  data: TaskListModel & { tasks: Task[] },
  deleteList: (id: string) => void
}) {
  const [title, setTitle] = useState<string>(data.title);
  const initialList: Task[] = data?.tasks ?? [];
  const [list, dispatch] = useReducer(listReducer, initialList);
  const { debounce } = useDebounce();
  const effectCount = useRef<number>(0);
  const { showMessage, messageController } = useMessageProvider();

  useEffect(() => {
    const updateTaskList = async () => {
      const taskListUpdateResponse = await fetch('/api/tasklist', {
        method: "PATCH",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          taskList: {
            id: data.id,
            title: title,
            tasks: list
          }
        })
      })
      if (!taskListUpdateResponse.ok) {
        showMessage('Something went wrong attempting to update task list. Status:' + taskListUpdateResponse.status, 'error')
      }
    }

    // This prevents database calls from running onMount with "use strict" (it runs twice)
    effectCount.current++;
    if (effectCount.current < (process.env.NODE_ENV === 'development' ? 3 : 2)) {
      return
    };

    debounce(() => {
      updateTaskList()
    })

  }, [list, title, debounce, data.id, data.boardId, showMessage])

  return (
    <Box sx={{
      background: colors.grey[900],
      padding: 2,
      borderRadius: '4px',
      minWidth: 300,
    }}>
      <Message controller={messageController} />
      <Stack direction="row" alignItems='center' gap={1} marginBottom={2}>
        <TextField
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          size="medium"
          variant="standard"
          placeholder="List Title..."
          sx={{
            width: '100%',
          }}
        />
        <IconButton
          onClick={() => deleteList(data.id)}
        >
          <DeleteIcon sx={{
            color: colors.grey[400]
          }} />
        </IconButton>
      </Stack>
      <Button
        onClick={() => dispatch({ type: 'add', task: { complete: false, text: '' } })}
        variant="outlined"
        fullWidth={true}
        startIcon={
          <AddIcon sx={{ color: colors.green.A400 }} />
        }
        sx={{ color: '#fff' }}
      >
        Add New Task
      </Button>
      <List>
        {list.map(task => (
          <ListItem
            key={task.id}
            alignItems='flex-start'
          >
            <Checkbox
              checked={task.complete}
              onChange={(e, checked) => {
                dispatch({
                  type: 'update',
                  taskId: task.id,
                  task: { complete: checked }
                })
              }}
              sx={{
                padding: 0,
                marginRight: 1
              }}
              disableRipple
            />
            <textarea
              value={task.text}
              ref={(current) => {
                if (current) {
                  resize(current);
                }
              }}
              onChange={
                (e) => {
                  dispatch({
                    type: 'update',
                    taskId: task.id,
                    task: { text: e.currentTarget.value }
                  })
                  resize(e.currentTarget);
                }
              }
              aria-label='task'
              placeholder='New task...'
              style={{
                width: '100%',
                background: colors.grey[900],
                color: colors.common.white,
                border: 'none',
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.fontSize,
                resize: 'none',
                overflow: 'hidden',
                height: '25px',
                lineHeight: 1.5
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default TaskList;