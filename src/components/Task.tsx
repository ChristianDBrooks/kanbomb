import { Checkbox, colors, ListItem } from "@mui/material";
import { useState } from "react";
import theme from "src/config/theme";
import useDebounce from "src/hooks/useDebounce";
import { BoardResponse } from "src/pages/api/board";
import requestUpdateTask, { TaskUpdate } from "src/requests/requestUpdateTask";
import { KeyedMutator } from "swr";

const resize = (element: HTMLTextAreaElement) => {
  element.style.height = "5px";
  element.style.height = (element.scrollHeight) + "px";
}

function Task({
  id,
  text,
  complete,
  taskListId,
  mutate
}: {
  id: string;
  text: string;
  complete: boolean;
  taskListId: string;
  mutate: KeyedMutator<BoardResponse>;
}) {

  // Controlled form inputs
  const [textInputValue, setTextInputValue] = useState(text);
  const [checkboxValue, setCheckboxValue] = useState(complete);
  const { debounce } = useDebounce();

  const handleUpdateTask = (updates: TaskUpdate) => {
    debounce(async () => {
      await requestUpdateTask(id, updates);
      mutate();
    }, 700)
  }

  return (
    <ListItem
      key={id}
      alignItems='flex-start'
    >
      <Checkbox
        checked={checkboxValue}
        onChange={(e, checked) => {
          setCheckboxValue(checked);
          handleUpdateTask({ complete: checked })
        }}
        sx={{
          padding: 0,
          marginRight: 1
        }}
        disableRipple
      />
      <textarea
        value={textInputValue}
        ref={(current) => {
          if (current) {
            resize(current);
          }
        }}
        onChange={
          (e) => {
            setTextInputValue(e.currentTarget.value)
            handleUpdateTask({ text: e.currentTarget.value })
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
  );
}

export default Task;