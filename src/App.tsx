import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TodoList } from "./components/TodoList";

export default function App() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        maxWidth: "100vw",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <Typography sx={{ mt: 0, mb: 2 }} variant="h1" component="div">
        Todo List
      </Typography>
      <TodoList />
    </Box>
  );
}
