import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, colors, IconButton, Stack, TextField } from "@mui/material";
import { useState } from 'react';

function TaskListMenu({
  title,
  handleUpdateTitle,
  handleDeleteTaskList,
  handleAddTask
}: {
  title: string;
  handleUpdateTitle: (title: string) => void
  handleDeleteTaskList: () => Promise<void>
  handleAddTask: () => Promise<void>
}) {
  const [titleInputValue, setTitleInputValue] = useState(title)

  return (
    <>
      <Stack direction="row" alignItems='center' gap={1} marginBottom={2}>
        <TextField
          value={titleInputValue}
          onChange={(event) => {
            setTitleInputValue(event.currentTarget.value)
            handleUpdateTitle(event.currentTarget.value)
          }
          }
          size="medium"
          variant="standard"
          placeholder="List Title..."
          sx={{
            width: '100%',
          }}
        />
        <IconButton
          onClick={() => handleDeleteTaskList()}
        >
          <DeleteIcon sx={{
            color: colors.grey[400]
          }} />
        </IconButton>
      </Stack>
      <Button
        onClick={() => handleAddTask()}
        variant="outlined"
        fullWidth={true}
        startIcon={
          <AddIcon sx={{ color: colors.green.A400 }} />
        }
        sx={{ color: '#fff' }}
      >
        Add New Task
      </Button>
    </>
  )
}

export default TaskListMenu;