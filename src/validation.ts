import { RA, E, flow, pipe, RNEA, Str, Mn } from "./deps";
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

const getEitherORMonoid = <A, B>(Mn: Mn.Monoid<A>) => ({
  concat: (a: E.Either<A, B>, b: E.Either<A, B>): E.Either<A, B> => {
    return E.isRight(a)
      ? a
      : E.isRight(b)
      ? b
      : E.left(Mn.concat(a.left, b.left));
  },
  empty: E.left(Mn.empty),
});

const ORvalidationMonoid = getEitherORMonoid<
  RNEA.ReadonlyNonEmptyArray<string>,
  string
>({
  concat: (a, b) => {
    const ruleA = a.join("");
    const ruleB = b.join("");

    return !Str.isEmpty(ruleB) && !Str.isEmpty(ruleA)
      ? [`${ruleA} OR ${ruleB}`]
      : !Str.isEmpty(ruleA)
      ? [ruleA]
      : [ruleB];
  },
  empty: RNEA.of(""),
});

const ANDvalidationMonoid = E.getValidationMonoid<
  RNEA.ReadonlyNonEmptyArray<string>,
  string
>(RNEA.getSemigroup(), Str.Monoid);

const composeValidation =
  (xs: RNEA.ReadonlyNonEmptyArray<(s: string) => E.Either<string, string>>) =>
  (s: string) => {
    return pipe(xs, RNEA.ap([s]), RNEA.map(E.mapLeft(RNEA.of)));
  };

const ANDvalidations = flow(
  composeValidation([notEmpty, min(5)]),
  Mn.concatAll(ANDvalidationMonoid),
);

const ORvalidations = flow(
  composeValidation([firstCharCap, firstCharNum]),
  Mn.concatAll(ORvalidationMonoid),
);

export const validate = (v: TodoItem) =>
  pipe(
    [ANDvalidations, ORvalidations],
    RA.ap([v.title]),
    Mn.concatAll(ANDvalidationMonoid),
    E.map(() => v),
  );
