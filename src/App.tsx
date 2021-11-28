import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TodoList } from "./components/TodoList";
import { env } from "./env";
import { EnvContextProvider } from "./EnvContext";

export default function App() {
  return (
    <EnvContextProvider value={env}>
      <Box
        sx={{
          flexGrow: 1,
          maxWidth: "100vw",
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        <Typography
          className={"rainbow-text"}
          sx={{ mt: 0, mb: 2 }}
          variant="h1"
          component="div"
        >
          FP-TS Todo List
        </Typography>
        <TodoList />
      </Box>
    </EnvContextProvider>
  );
}
