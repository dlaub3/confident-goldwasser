import React from "react";
import { ListState, TodoItem } from "../types";
import { lenses } from "../optics";
import { O, RA, pipe, monocle, State, Str } from "../deps";
import { findFirst, modifyOption } from "monocle-ts/lib/Optional";
import { flow, identity } from "fp-ts/lib/function";
import { ItemId } from "../newtypes";
import { coerceNewType, pick } from "../utils";
import { contramap } from "fp-ts/lib/Eq";
const { Lens, Optional, fromTraversable } = monocle;

const todoListL = Lens.fromProp<ListState>()("todoList");
const todoItemTraversal = fromTraversable(RA.Traversable)<TodoItem>();
const traversableTodoList = todoListL.composeTraversal(todoItemTraversal);
const doneTraversable = traversableTodoList.composeLens(lenses.done);

const todoListOptional = new Optional<readonly TodoItem[], readonly TodoItem[]>(
  function getOption(xs) {
    return RA.isNonEmpty(xs) ? O.some(xs) : O.none;
  },
  function set(xs) {
    return () => xs;
  },
);

const updateItem = (
  id: ItemId,
  fn: (() => TodoItem) | ((x: TodoItem) => TodoItem),
) =>
  pipe(
    todoListL.composeOptional(todoListOptional),
    findFirst((x) => x.id === id),
    modifyOption(fn),
  );

const updateOptionalState =
  (fn: (s: ListState) => O.Option<ListState>) => (s: ListState) =>
    pipe(
      s,
      fn,
      O.fold(() => s, identity),
    );

const updateOrFallbackOptional =
  (
    updateFn: (s: ListState) => O.Option<ListState>,
    fallbackFn: (s: ListState) => ListState,
  ) =>
  (s: ListState) =>
    pipe(
      s,
      updateFn,
      O.fold(() => fallbackFn(s), identity),
    );

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

const findItemById = pipe(
  Str.Eq,
  contramap<string, TodoItem>((s) => coerceNewType(s.id)),
  RA.elem,
);

const isFalse = (x: boolean): x is false => x === false;
const isTrue = (x: boolean): x is true => x === true;

const deleteItems = (xs: Array<TodoItem>) => {
  return pipe(
    State.modify<ListState>(
      todoListL.modify((list) =>
        pipe(
          list,
          RA.filter((t) => pipe(xs, findItemById(t), isFalse)),
        ),
      ),
    ),
  );
};
const toggleItemDone = (id: ItemId) =>
  updateItem(id, pipe(lenses.done.modify((s) => !s)));

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
  return pipe(State.modify(doneTraversable.set(done)));
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
