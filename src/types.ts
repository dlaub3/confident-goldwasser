import { itemC } from "./codecs";
import { IOTS, IOTST, newTypes } from "./deps";

export interface ItemId
  extends newTypes.Newtype<
    { readonly ItemId: unique symbol },
    IOTST.NonEmptyString
  > {}

type TodoItemBrandSymbol = { readonly TodoItem: symbol };

type TodoItemT = IOTS.TypeOf<typeof itemC>;

export type TodoItem = IOTS.Branded<TodoItemT, TodoItemBrandSymbol>;

export interface ListState {
  todoList: readonly TodoItem[];
}
