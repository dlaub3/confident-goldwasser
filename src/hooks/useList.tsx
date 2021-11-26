import { TodoItem } from "../types";
import { itemIdIso, lenses } from "../optics";
import { O, RA, pipe, monocle, State } from "../deps";
import { findFirst, modifyOption } from "monocle-ts/lib/Optional";
import { identity } from "fp-ts/lib/function";
import { highlight } from "../utils";
import { getDefaultItem, newItemId } from "../helpers";
import { ItemId } from "../newtypes";
import * as tt from "io-ts-types";

const { Lens, Prism, Optional, fromTraversable } = monocle;

// State is a Monad over a function that
// receives a new State value (s) and the result (a).
// computations are calculated within the state ADT
// and the result is the output,
// the type of state does not change
interface ListState {
  todoList: readonly TodoItem[];
}

const testId = itemIdIso.wrap("testId" as tt.NonEmptyString);

export const initialState: ListState = {
  todoList: [getDefaultItem()],
};

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

const updateItem = (id: ItemId, fn: (x: TodoItem) => TodoItem) =>
  pipe(
    todoListL.composeOptional(todoListOptional),
    findFirst((x) => x.id === id),
    modifyOption(fn),
  );

const updateItemTitle = (id: ItemId, name: string) =>
  updateItem(id, lenses.title.set(name));

const updateItemDescription = (id: ItemId, name: string) =>
  updateItem(id, lenses.description.set(name));

const updateOptionalState =
  (fn: (s: ListState) => O.Option<ListState>) => (s: ListState) =>
    pipe(
      s,
      fn,
      O.fold(() => s, identity),
    );

export function run() {
  highlight.cyan`${pipe(
    State.modify((x: ListState) => doneTraversable.set(true)(x)),
    State.chain(() =>
      State.modify(updateOptionalState(updateItemTitle(testId, "Learn FP-TS"))),
    ),
    State.chain(() =>
      State.modify(
        updateOptionalState(
          updateItemDescription(
            testId,
            "FP-TS is worth leanring since you write so much functional TypeScript",
          ),
        ),
      ),
    ),
    State.execute(initialState),
  )}`;
}
