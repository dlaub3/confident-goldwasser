import React from "react";
import { ListState, TodoItem } from "../types";
import { RA, pipe, State, Str } from "../deps";
import { flow } from "fp-ts/lib/function";
import { ItemId } from "../newtypes";
import { coerceNewType, isFalse, pick } from "../utils";
import { contramap } from "fp-ts/lib/Eq";
import {
  setDoneTraversable,
  todoListL,
  toggleItemDone,
  updateItem,
  updateOptionalState,
  updateOrFallbackOptional,
} from "../optics";

const updateOrInsert = (item: TodoItem) => {
  return pipe(
    State.modify(
      updateOrFallbackOptional(
        updateItem(item.id, () => item),
        todoListL.modify(RA.prepend(item)),
      ),
    ),
  );
};

const isItemInSet = (xs: TodoItem[]) => (item: TodoItem) =>
  pipe(
    Str.Eq,
    contramap<string, TodoItem>((s) => coerceNewType(s.id)),
    RA.elem,
  )(item)(xs);

const deleteItems = (xs: TodoItem[]) => {
  return pipe(
    State.modify<ListState>(
      todoListL.modify(RA.filter(flow(isItemInSet(xs), isFalse))),
    ),
  );
};

const toggleDone = (id: ItemId) =>
  State.modify(updateOptionalState(toggleItemDone(id)));

const isDone = (s: TodoItem) => s.done === true;
const isTodo = (s: TodoItem) => !isDone(s);

const getDoneList = () =>
  State.gets<ListState, readonly TodoItem[]>(
    flow(pick("todoList"), RA.filter(isDone)),
  );

const getTodoList = () =>
  State.gets<ListState, readonly TodoItem[]>(
    flow(pick("todoList"), RA.filter(isTodo)),
  );

const setAllDone = (done: boolean) => () => {
  return pipe(State.modify(setDoneTraversable(done)));
};

export const useList = (props: ListState = { todoList: [] }) => {
  const [list, setList] = React.useState<ListState>(props);

  return {
    todoList: pipe(getTodoList(), State.evaluate(list)),
    doneList: pipe(getDoneList(), State.evaluate(list)),
    editItem: flow(updateOrInsert, State.execute(list), setList),
    onDelete: flow(deleteItems, State.execute(list), setList),
    toggleItemDone: flow(toggleDone, State.execute(list), setList),
    toggleDone: flow(setAllDone(true), State.execute(list), setList),
    toggleTodo: flow(setAllDone(false), State.execute(list), setList),
  };
};
