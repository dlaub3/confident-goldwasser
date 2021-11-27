import { Highlighter } from "@catpic/console-highlighter";

const highlighter = new Highlighter({ theme: "dracula" });

export const { highlight } = highlighter;

export const pick =
  <K extends string>(key: K) =>
  <S extends { [k in K]: unknown }>(struct: S) =>
    struct[key];
