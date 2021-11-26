import * as tt from "io-ts-types";
import * as t from "io-ts";
import { ItemId } from "./newtypes";
import { TodoItem } from "./types";

export const itemIdC = tt.fromNewtype<ItemId>(tt.NonEmptyString);

export const itemC = t.type({
  id: itemIdC,
  title: t.string,
  description: t.union([t.string, t.undefined]),
  done: t.boolean,
});

export const todoItemC = t.brand(
  itemC,
  (x: unknown): x is TodoItem => itemC.is(x),
  "TodoItem",
);
