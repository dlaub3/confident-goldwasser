import * as tt from "io-ts-types";
import * as t from "io-ts";
import { ItemId } from "./newtypes";
import { TodoItem } from "./types";

export const itemIdC = tt.fromNewtype<ItemId>(tt.NonEmptyString);

export const itemC = t.type({
  id: t.string,
  title: t.string,
  description: t.string,
  done: t.boolean,
});
