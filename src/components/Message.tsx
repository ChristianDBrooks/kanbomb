import { Alert, AlertColor, Snackbar, SnackbarCloseReason } from "@mui/material";
import { SyntheticEvent, useState } from "react";

interface MessageController {
  open: boolean;
  handleClose: ((event: Event | SyntheticEvent<any, Event>, reason: SnackbarCloseReason) => void) | undefined;
  message: string;
  severity: AlertColor;
}

interface UseMessageProviderResponse {
  showMessage: (message: string, severity: AlertColor) => void;
  messageController: MessageController;
}

/** Place this Component somewhere in the root of your component and attach a new message controller provided by the useMessageProvider hook.*/
function Message({ controller }: { controller: MessageController }) {
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

/** Anytime a user normally wants to show a Snackbar they have to create state and a
 * function to modify that state inside the parent component. This provider and 
 * controller pattern cuts concerns by providing all the logic for setting up the 
 * Snackbar and using it in this Component/Hook combo. Then when you want to display 
 * the message, call the showMessage function */
export function useMessageProvider() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('success');
  const handleClose = () => setOpen(false);

  /** Call this function when you want to show the Message component that exists in your JSX. */
  const showMessage = (message: string, severity: AlertColor) => {
    setMessage(message)
    setSeverity(severity);
    setOpen(true);
  }

  const result: UseMessageProviderResponse = {
    showMessage,
    /** messageController is a combination of all the state and logic needed to run the Message component. */
    messageController: {
      open,
      handleClose,
      message: message,
      severity,
    }
  }

  return result;
}

export default Message;