import { TodoItem } from "../types";
import { lenses } from "../optics";
import { O, RA, pipe, monocle, State } from "../deps";
import { findFirst, modifyOption } from "monocle-ts/lib/Optional";
import { identity } from "fp-ts/lib/function";

const { Lens, Prism, Optional, fromTraversable } = monocle;

// State is a Monad over a function that
// receives a new State value (s) and the result (a).
// computations are calculated within the state ADT
// and the result is the output,
// the type of state does not change
interface ListState {
  todoList: readonly TodoItem[];
}
const testId = "testId";

const initialTodoitem: TodoItem = {
  id: testId,
  title: "",
  description: "", // optional
  done: false,
};
const initialState: ListState = {
  todoList: [initialTodoitem],
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

const modifyItem = (id: string) => (fn: (x: TodoItem) => TodoItem) =>
  pipe(
    todoListL.composeOptional(todoListOptional),
    findFirst((x) => x.id === id),
    modifyOption(fn),
  );

console.log(
  pipe(
    State.modify((x: ListState) => doneTraversable.set(true)(x)),
    State.chain(() =>
      State.modify((state) =>
        pipe(
          pipe(lenses.description.set("what"), modifyItem(testId)),
          O.fold(() => state, identity),
        ),
      ),
    ),
    State.execute(initialState),
  ),
);
