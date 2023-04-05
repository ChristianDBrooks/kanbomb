import TaskList from '@components/TaskList';
import AddIcon from '@mui/icons-material/Add';
import { Box, colors, Stack, Typography } from "@mui/material";
import { Task, TaskList as ITaskList } from "@prisma/client";
import { BoardResponse } from 'src/pages/api/board';
import requestAddTaskList from 'src/requests/requestAddTaskList';
import { KeyedMutator } from 'swr';
import Message, { useMessageProvider } from './Message';

function Board({
  id,
  title,
  taskLists,
  mutate
}: {
  id: string;
  title: string;
  taskLists: (ITaskList & { tasks: Task[] })[];
  mutate: KeyedMutator<BoardResponse>;
}) {

  const { showMessage, messageController } = useMessageProvider()

  const handleAddTaskList = async () => {
    await requestAddTaskList(id);
    mutate();
  }

  return (
    <Box overflow='auto'>
      <Message controller={messageController} />
      <Typography
        variant="h4"
        paddingY={2}
      >{title}</Typography>
      <Stack direction="row" gap={2}>
        {
          taskLists.map(taskList => (
            <TaskList
              key={taskList.id}
              boardId={taskList.boardId}
              id={taskList.id}
              title={taskList.title}
              tasks={taskList.tasks}
              mutate={mutate}
            />)
          )
        }
        <Box
          onClick={handleAddTaskList}
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
  );
}

export default Board;