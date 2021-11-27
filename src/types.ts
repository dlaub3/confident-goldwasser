import type { Branded } from "io-ts";
import { itemC } from "./codecs";
import * as t from "io-ts";

/*
 * The alternaive is to manually create a branded type.
 * ```
 *  interface TodoItemBrand {
 *    readonly TodoItem: unique symbol;
 *  }
 * ```
 */

type TodoItemBrandSymbol = { readonly TodoItem: symbol };

type TodoItemT = t.TypeOf<typeof itemC>;

export type TodoItem = Branded<TodoItemT, TodoItemBrandSymbol>;

// interface TodoItemBrand extends Brand<TodoItemBrandSymbol> {}

export interface ListState {
  todoList: readonly TodoItem[];
}
