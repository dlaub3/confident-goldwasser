/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { TodoItem } from "./TodoItem";
import List from "@mui/material/List";
import { EditItemDialog } from "./EditItemDialog";
import * as O from "fp-ts/lib/Option";
import { TodoItem as Item } from "../types";
import { getDefaultItem } from "../helpers";
import { useList } from "../hooks/useList";
import { coerceNewType } from "../utils";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { css } from "@emotion/react";
import { RA } from "../deps";

export const TodoList = () => {
  const [item, setItem] = React.useState<O.Option<Item>>(O.none);

  const state = useList({ todoList: [getDefaultItem()] });

  const handleClose = () => {
    setItem(O.none);
  };

  const onToggleDone = (item: Item) => {
    return () => state.toggleItemDone(item.id);
  };

  const onEdit = (x: Item) => () => setItem(O.some(x));

  return (
    <div
      css={css`
        display: flex;
        flex-flow: column nowrap;
        flex: 1;
        flex-grow: 1;
      `}
    >
      <Box>
        <Button
          css={css`
            align-self: flex-end;
            margin-right: 0;
          `}
          title="Add Item"
          onClick={() => {
            setItem(O.some(getDefaultItem()));
          }}
          aria-label="add"
          startIcon={<AddIcon />}
        >
          Add Todo Item
        </Button>
      </Box>
      <Grid
        container
        spacing={2}
        display={"flex"}
        flex={1}
        flexDirection={"row"}
      >
        <Grid
          item
          xs={6}
          display={"flex"}
          flexDirection={"column"}
          flexGrow={1}
        >
          <Paper
            variant="outlined"
            elevation={3}
            sx={{
              p: 2,
              gap: 2,
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h4" component="h2">
                TODO
              </Typography>

              <Button
                disabled={RA.isEmpty(state.todoList)}
                css={css`
                  align-self: flex-start;
                `}
                onClick={() => {
                  state.toggleDone();
                }}
              >
                Move to Done
              </Button>
            </Box>
            <List dense>
              {state.todoList.map((x) => (
                <TodoItem
                  key={coerceNewType(x.id)}
                  item={x}
                  onEdit={onEdit(x)}
                  onToggleDone={onToggleDone(x)}
                />
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid
          item
          xs={6}
          display={"flex"}
          flexDirection={"column"}
          flexGrow={1}
        >
          <Paper
            variant="outlined"
            elevation={3}
            sx={{
              p: 2,
              gap: 2,
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h4" component="h2">
                DONE
              </Typography>

              <Button
                disabled={RA.isEmpty(state.doneList)}
                css={css`
                  align-self: flex-start;
                `}
                onClick={() => {
                  state.toggleTodo();
                }}
              >
                Move to TODO
              </Button>
            </Box>
            <List>
              {state.doneList.map((x) => (
                <TodoItem
                  key={coerceNewType(x.id)}
                  item={x}
                  onEdit={onEdit(x)}
                  onToggleDone={onToggleDone(x)}
                />
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
      <EditItemDialog
        handleSave={state.editItem}
        isOpen={O.isSome(item)}
        handleClose={handleClose}
        item={item}
      />
    </div>
  );
};
