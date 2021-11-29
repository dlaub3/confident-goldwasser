import { IOTS, IOTST } from "./deps";
import { ItemId } from "./newtypes";
import { TodoItem } from "./types";

export const itemIdC = IOTST.fromNewtype<ItemId>(IOTST.NonEmptyString);

export const itemC = IOTS.type({
  id: itemIdC,
  title: IOTS.string,
  description: IOTS.union([IOTS.string, IOTS.undefined]),
  done: IOTS.boolean,
});

export const todoItemC = IOTS.brand(
  itemC,
  (x: unknown): x is TodoItem => itemC.is(x),
  "TodoItem",
);
