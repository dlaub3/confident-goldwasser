import { Highlighter } from "@catpic/console-highlighter";
import { Newtype } from "newtype-ts";

const highlighter = new Highlighter({ theme: "dracula" });

export const { highlight } = highlighter;

export const pick =
  <K extends string>(key: K) =>
  <S extends { [k in K]: unknown }>(struct: S) =>
    struct[key];

export const coerceNewType = <T extends unknown>(x: Newtype<unknown, T>) =>
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

export const isNullaryFn = (x: Function): x is <T>() => T => x.length === 0;

export const isUnaryFn = (x: Function): x is <A, B>(x: A) => B =>
  x.length === 1;
