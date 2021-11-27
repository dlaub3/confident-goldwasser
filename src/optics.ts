import { iso, prism } from "newtype-ts";
import type { ItemId } from "./newtypes";
import { itemIdC } from "./codecs";
import { Lens } from "monocle-ts";
import { TodoItem } from "./types";

export const itemIdIso = iso<ItemId>();
export const itemIdPrism = prism<ItemId>(itemIdC.is);

const done = Lens.fromProp<TodoItem>()("done");
const title = Lens.fromProp<TodoItem>()("title");
const description = Lens.fromProp<TodoItem>()("description");

export const lenses = {
  done,
  title,
  description,
};
