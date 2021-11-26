import { iso, prism } from "newtype-ts";
import type { ItemId } from "./newtypes";
import { itemC, itemIdC, todoItemC } from "./codecs";
import { Lens } from "monocle-ts";
import * as tt from "io-ts-types";
import * as t from "io-ts";
import { TodoItem } from "./types";

export const itemIdIso = iso<ItemId>();
export const itemIdPrism = prism<ItemId>(itemIdC.is);

//export const lenses = tt.getLenses(itemC);

const done = Lens.fromProp<TodoItem>()("done");
const title = Lens.fromProp<TodoItem>()("title");
const description = Lens.fromProp<TodoItem>()("description");

export const lenses = {
  done,
  title,
  description,
};
