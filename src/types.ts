import type { Branded, Brand } from "io-ts";
import { itemC } from "./codecs";
import * as t from "io-ts";
import { ItemId } from "./newtypes";

/*
 * `Brand` creates a Branded type using a string value
 * which isn't unique. This may or may not be a problem.
 * The alternaive is to manually create a branded type.
 * ```
 *  interface TodoItemBrand {
 *    readonly TodoItem: unique symbol;
 *  }
 * ```
 * interface TodoItemBrand extends Brand<"TodoItem"> {}
 *
 */

type TodoItemT = t.TypeOf<typeof itemC>;

type TodoItemBrandSymbol = { readonly TodoItem: symbol };

export interface TodoItemBrand extends Brand<TodoItemBrandSymbol> {}

export type TodoItem = Branded<TodoItemT, TodoItemBrandSymbol>;
