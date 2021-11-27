import * as E from "fp-ts/Either";
import { Mn, Ap, Apl, pipe, RA, RNEA, Str, A } from "./deps";
import { TodoItem } from "./types";

const min =
  (minLength: number) =>
  (s: string): E.Either<string, string> =>
    s.length >= minLength
      ? E.right(s)
      : E.left(`must HAVE at least ${minLength} characters`);

const notEmpty = (s: string): E.Either<string, string> =>
  s === "" ? E.left(`must NOT BE empty`) : E.right(s);

const firstCharCap = (s: string): E.Either<string, string> =>
  /^[A-Z]/.test(s) ? E.right(s) : E.left("must BEGIN with a capitol letter");

const firstCharNum = (s: string): E.Either<string, string> =>
  /^[0-9]/.test(s) ? E.right(s) : E.left("must BEGIN with a number");

const composeValidation =
  (xs: RNEA.ReadonlyNonEmptyArray<(s: string) => E.Either<string, string>>) =>
  (s: string) => {
    return pipe(xs, RNEA.ap([s]), RNEA.map(E.mapLeft(RNEA.of)));
  };

export const validate = (v: TodoItem) =>
  pipe(
    v.title.trim(),
    composeValidation([notEmpty, min(5), firstCharCap]),
    RNEA.reduce(
      E.right(v.title.trim()),
      E.getValidationMonoid<RNEA.ReadonlyNonEmptyArray<string>, string>(
        RNEA.getSemigroup(),
        Str.Monoid,
      ).concat,
    ),
    E.map(() => v),
  );
