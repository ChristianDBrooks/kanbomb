import { Backdrop, CircularProgress } from "@mui/material";
import { MouseEventHandler } from "react";

function Loading({open, handleClose}: {open: boolean, handleClose?: MouseEventHandler<HTMLElement>}) {
  return ( 
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={handleClose}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
   );
}

export default Loading;