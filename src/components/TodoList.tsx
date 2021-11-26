import React from "react";
import { TodoItem } from "./TodoItem";
import List from "@mui/material/List";
import { EditItemDialog } from "./EditItemDialog";
import * as O from "fp-ts/lib/Option";
import { TodoItem as Item } from "../types";
import { getDefaultItem } from "../helpers";

const item1 = getDefaultItem();

export const TodoList = () => {
  const [item, setItem] = React.useState<O.Option<Item>>(O.some(item1));

  const handleClose = () => {
    setItem(O.none);
  };

  return (
    <>
      <List dense>
        <TodoItem item={item1} onEdit={() => setItem(O.some(item1))} />
      </List>
      <EditItemDialog
        handleSave={() => {}}
        isOpen={O.isSome(item)}
        handleClose={handleClose}
        item={item}
      />
    </>
  );
};
