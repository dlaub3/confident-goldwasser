import { E, flow, Mn, pipe, RNEA, Str } from "./deps";

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
    const ruleA = a.join(" AND ");
    const ruleB = b.join(" AND ");

    return !Str.isEmpty(ruleB) && !Str.isEmpty(ruleA)
      ? [`${ruleA} OR ${ruleB}`]
      : !Str.isEmpty(ruleA)
      ? [ruleA]
      : [ruleB];
  },
  empty: RNEA.of(""),
});

export const ANDvalidationMonoid = E.getValidationMonoid<
  RNEA.ReadonlyNonEmptyArray<string>,
  string
>(RNEA.getSemigroup(), Str.Monoid);

export const composeValidation =
  <A, B>(
    xs: RNEA.ReadonlyNonEmptyArray<
      (s: A) => E.Either<RNEA.ReadonlyNonEmptyArray<B>, A>
    >,
  ) =>
  (s: A) => {
    return pipe(xs, RNEA.ap([s]));
  };

export const And = (
  ...args: RNEA.ReadonlyNonEmptyArray<
    (x: string) => E.Either<RNEA.ReadonlyNonEmptyArray<string>, string>
  >
): ((s: string) => E.Either<RNEA.ReadonlyNonEmptyArray<string>, string>) => {
  return flow(composeValidation(args), Mn.concatAll(ANDvalidationMonoid));
};

export const Or = (
  ...args: RNEA.ReadonlyNonEmptyArray<
    (x: string) => E.Either<RNEA.ReadonlyNonEmptyArray<string>, string>
  >
): ((s: string) => E.Either<RNEA.ReadonlyNonEmptyArray<string>, string>) => {
  return flow(composeValidation(args), Mn.concatAll(ORvalidationMonoid));
};
