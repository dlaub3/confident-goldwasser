import { O, pipe, RD, NT, Highlighter } from "./deps";

const highlighter = new Highlighter({ theme: "dracula" });

export const { highlight } = highlighter;

export const pick =
  <K extends string>(key: K) =>
  <S extends { [k in K]: unknown }>(struct: S) =>
    struct[key];

export const coerceNewType = <T extends unknown>(x: NT.Newtype<unknown, T>) =>
  x as unknown as T;

export const tap =
  (name: string) =>
  <T>(x: T) => {
    console.log(
      `%c __TAP__${name}`,
      "background: cornflowerblue; color: white;",
      x,
    );

    return x;
  };

export const isFalse = (x: boolean): x is false => x === false;
export const isTrue = (x: boolean): x is true => x === true;

export const isNullaryFn = (x: Function): x is <T>() => T => x.length === 0;

export const isUnaryFn = (x: Function): x is <A, B>(x: A) => B =>
  x.length === 1;

export const getWindowEnv = (key: string) => (window as any)?.__ENV__?.[key];

export const runWithEnv = (key: string, fn: () => void) => {
  getWindowEnv(key) === true && fn();
};

export const renderOption = <T>(
  option: O.Option<T>,
  onSome: (x: T) => JSX.Element,
  onNone: () => JSX.Element | null = () => null,
) => pipe(option, O.fold(onNone, onSome));

export type RdRenderers<E, T> = [
  onInitial: () => JSX.Element,
  onPending: () => JSX.Element,
  onFailure: (e: E) => JSX.Element,
  onSuccess: (x: T) => JSX.Element,
];

export const renderRemoteData = <E, T>(
  rd: RD.RemoteData<E, T>,
  onInitial: RdRenderers<E, T>[0],
  onPending: RdRenderers<E, T>[1],
  onFailure: RdRenderers<E, T>[2],
  onSuccess: RdRenderers<E, T>[3],
) => pipe(rd, RD.fold(onInitial, onPending, onFailure, onSuccess));
