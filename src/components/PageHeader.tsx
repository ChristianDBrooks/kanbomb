import { Box, Typography } from "@mui/material";

function PageHeader({title}: {title: string}) {
  return ( <Box sx={{ py: 2}}>
    <Typography variant="h4" sx={{fontWeight: 700}}>{title}</Typography>
  </Box> );
}
export default PageHeader;