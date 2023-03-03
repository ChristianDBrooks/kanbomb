import { Alert, AlertColor, Snackbar, SnackbarCloseReason } from "@mui/material";
import { SyntheticEvent, useState } from "react";

interface MessageController {
  open: boolean;
  handleClose: ((event: Event | SyntheticEvent<any, Event>, reason: SnackbarCloseReason) => void) | undefined;
  message: string;
  severity: AlertColor;
}

function ControlledMessage({
  controller,
}: {
  controller: MessageController
}) {
  return (
    <Snackbar
      open={controller.open}
      onClose={controller.handleClose}
      autoHideDuration={5000}
    >
      <Alert severity={controller.severity} sx={{ width: '100%' }}>
        {controller.message}
      </Alert>
    </Snackbar>
  );
}

export function useMessageController() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('success');

  const message = (message: string, severity: AlertColor) => {
    setValue(message);
    setSeverity(severity);
    setOpen(true);
  }

  const result: {
    message: (message: string, severity: AlertColor) => void;
    controller: MessageController;
  } = {
    message,
    controller: {
      open,
      handleClose: () => setOpen(false),
      message: value,
      severity,
    }
  }

  return result;
}

export default ControlledMessage;