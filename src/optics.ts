import type { ItemId } from "./newtypes";
import { itemIdC } from "./codecs";
import { ListState, TodoItem } from "./types";
import { NT, IOTST, O, RA, pipe, monocle, identity } from "./deps";
import { findFirst, modifyOption } from "monocle-ts/Optional";

export const { Lens, Optional, fromTraversable } = monocle;

/* TODO: Refactor to pipeable API  Daniel Laubacher  Wed 01 Dec 2021 **/

export const newItemId = (s: IOTST.NonEmptyString): ItemId => {
  return itemIdIso.wrap(s);
};

export const itemIdIso = NT.iso<ItemId>();
export const itemIdPrism = NT.prism<ItemId>(itemIdC.is);

export const done = Lens.fromProp<TodoItem>()("done");
export const title = Lens.fromProp<TodoItem>()("title");
export const description = Lens.fromProp<TodoItem>()("description");

export const todoListL = Lens.fromProp<ListState>()("todoList");
export const todoItemTraversal = fromTraversable(RA.Traversable)<TodoItem>();
export const traversableTodoList =
  todoListL.composeTraversal(todoItemTraversal);
export const doneTraversable = traversableTodoList.composeLens(done);

export const updateItem = (
  id: ItemId,
  fn: (() => TodoItem) | ((x: TodoItem) => TodoItem),
) =>
  pipe(
    todoListL.asOptional(),
    findFirst((x) => x.id === id),
    modifyOption(fn),
  );

export const updateOptionalState =
  (fn: (s: ListState) => O.Option<ListState>) => (s: ListState) =>
    pipe(
      s,
      fn,
      O.fold(() => s, identity),
    );

export const updateOrFallbackOptional =
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

export const toggleItemDone = (id: ItemId) =>
  updateItem(id, pipe(done.modify((s) => !s)));
