import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Box, Button, Checkbox, colors, IconButton, List, ListItem, Stack, TextField } from "@mui/material";
import { Task, TaskList } from '@prisma/client';
import { ChangeEvent, Reducer, useReducer, useState } from 'react';
import theme from 'src/config/theme';
import { uuid } from 'uuidv4';

type ListItem = {
  id: string;
  complete: boolean;
  text: string;
}

type List = ListItem[];

type ListAction = {
  type: 'add',
  item: Omit<ListItem, "id">;
} | {
  type: 'update',
  itemId: string | number;
  item: Partial<Omit<ListItem, "id">>;
} | {
  type: 'delete',
  itemId: string | number;
};

const resize = (event: ChangeEvent<HTMLTextAreaElement>) => {
  event.target.style.height = "5px";
  event.target.style.height = (event.target.scrollHeight) + "px";
}

const listReducer: Reducer<List, ListAction> = (state, action) => {
  switch (action.type) {
    case "add": {
      // Copy new state array and push new item to front of array
      return [{ id: uuid(), ...action.item }, ...state];
    }
    case "update": {
      // Identify index of target item from the id provided.
      let targetIndex = state.findIndex(i => {
        return i.id === action.itemId;
      })
      // Make sure item still exists, (hasn't been deleted and correct id provided)
      if (targetIndex < 0) {
        console.error('Could not find item to update when looking for ' + action.itemId + '.')
        return state;
      };
      // Clone and insert new item data into state array
      state.splice(targetIndex, 1, // Copy state array
        {
          ...state[targetIndex],      // copy old item properties
          ...action.item              // insert any newly updated item propertes
        }
      )
      return [...state]
    }
    case "delete": {
      return [ // Copy state array
        ...state.filter(item => item.id !== action.itemId)
      ];
    }
    default:
      throw Error("Unknown action.")
  }
}

function BoardList({
  taskList,
  deleteList
}: {
  taskList: TaskList & { tasks: Task[] },
  deleteList: (id: string) => void
}) {
  const [title, setTitle] = useState<string>(taskList.title);
  const initialList: List = taskList?.tasks ?? [{ id: uuid(), complete: false, text: '' }]
  const [list, dispatch] = useReducer(listReducer, initialList);

  return (
    <Box sx={{
      background: colors.grey[900],
      padding: 2,
      borderRadius: '4px',
      minWidth: 300,
    }}>
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
          onClick={() => deleteList(taskList.id)}
        >
          <DeleteIcon sx={{
            color: colors.grey[400]
          }} />
        </IconButton>
      </Stack>
      <Button
        onClick={() => dispatch({ type: 'add', item: { complete: false, text: '' } })}
        variant="outlined"
        fullWidth={true}
        startIcon={
          <AddIcon sx={{ color: colors.green.A400 }} />
        }
        sx={{ color: '#fff' }}
      >
        Add list item
      </Button>
      <List>
        {list.map(item => (
          <ListItem
            key={item.id}
            alignItems='flex-start'
          >
            <Checkbox
              checked={item.complete}
              onChange={(e, checked) => {
                dispatch({
                  type: 'update',
                  itemId: item.id,
                  item: { complete: checked }
                })
              }}
              sx={{
                padding: 0,
                marginRight: 1
              }}
              disableRipple
            />
            <textarea
              value={item.text}
              onChange={
                (e) => {
                  dispatch({
                    type: 'update',
                    itemId: item.id,
                    item: { text: e.currentTarget.value }
                  })
                  resize(e);
                }
              }
              aria-label='list item'
              placeholder='New list item...'
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

export default BoardList;