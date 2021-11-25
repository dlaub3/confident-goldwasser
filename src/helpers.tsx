import React from "react";
import { ItemId } from "./newtypes";
import { itemIdIso } from "./optics";
import { v4 as uuidv4 } from "uuid";
import tt from "io-ts-types";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";

export const newItemId = (): ItemId => {
  return itemIdIso.wrap(uuidv4() as tt.NonEmptyString);
};

export const getDefaultItem = () => ({
  id: newItemId(),
  title: "",
  description: "",
  done: false,
});

export const renderOption = <T extends unknown>(
  option: O.Option<T>,
  onSome: (x: T) => JSX.Element,
  onNone: () => JSX.Element = () => <></>,
) => pipe(option, O.fold(onNone, onSome));
