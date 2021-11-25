import { ItemId } from "./newtypes";

export interface TodoItem {
  // TODO readonly __type: unique symbol;
  id: string; // none empty string
  title: string;
  description: string;
  done: boolean;
}
