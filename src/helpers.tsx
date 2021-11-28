import { ItemId } from "./newtypes";
import { itemIdIso } from "./optics";
import { v4 as uuidv4 } from "uuid";
import tt from "io-ts-types";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { TodoItem } from "./types";
import { RD } from "./deps";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

export const newItemId = (): ItemId => {
  return itemIdIso.wrap(uuidv4() as tt.NonEmptyString);
};

export const getDefaultItem = () =>
  ({
    id: newItemId(),
    title: "",
    done: false,
  } as TodoItem);

export const renderOption = <T,>(
  option: O.Option<T>,
  onSome: (x: T) => JSX.Element,
  onNone: () => JSX.Element = () => <></>,
) => pipe(option, O.fold(onNone, onSome));

export type RdRenderers<E, T> = [
  onInitial: () => JSX.Element,
  onPending: () => JSX.Element,
  onFailure: (e: E) => JSX.Element,
  onSuccess: (x: T) => JSX.Element,
];

export const renderRemoteData = <E, T>(
  rd: RD.RemoteData<E, T>,
  onInitial: RdRenderers<E, T>[0] = () => <></>,
  onPending: RdRenderers<E, T>[1] = () => <></>,
  onFailure: RdRenderers<E, T>[2] = () => <></>,
  onSuccess: RdRenderers<E, T>[3],
) => pipe(rd, RD.fold(onInitial, onPending, onFailure, onSuccess));
