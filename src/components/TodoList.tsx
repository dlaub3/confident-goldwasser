import React from "react";
import { TodoItem } from "./TodoItem";
import List from "@mui/material/List";
import { EditItemDialog } from "./EditItemDialog";
import * as O from "fp-ts/lib/Option";
import { TodoItem as Item } from "../types";
import { getDefaultItem } from "../helpers";
import { useList } from "../hooks/useList";

export const TodoList = () => {
  const [item, setItem] = React.useState<O.Option<Item>>(O.none);

  const state = useList({ todoList: [getDefaultItem()] });

  const handleClose = () => {
    setItem(O.none);
  };

  return (
    <>
      <List dense>
        {state.todoList.map((x) => (
          <TodoItem item={x} onEdit={() => setItem(O.some(x))} />
        ))}
        {state.doneList.map((x) => (
          <TodoItem item={x} onEdit={() => setItem(O.some(x))} />
        ))}
      </List>
      <EditItemDialog
        handleSave={state.editItem}
        isOpen={O.isSome(item)}
        handleClose={handleClose}
        item={item}
      />
    </>
  );
};
