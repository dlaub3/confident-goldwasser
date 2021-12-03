import { E, flow, pipe, RNEA, Str, Mn } from "./deps";
import { title } from "./optics";
import { TodoItem } from "./types";

const max = (maxLength: number) =>
  E.fromPredicate(
    (s: string) => s.length <= maxLength,
    () => RNEA.of(`must BE LESS than ${maxLength} characters`),
  );

const min = (minLength: number) =>
  E.fromPredicate(
    (s: string) => s.length >= minLength,
    () => RNEA.of(`must HAVE at least ${minLength} characters`),
  );

const notEmpty = E.fromPredicate(
  (s: string) => s !== "",
  () => RNEA.of(`must NOT BE empty`),
);

const fstCharCap = E.fromPredicate(
  (s: string) => /^[A-Z]/.test(s),
  () => RNEA.of(`must BEGIN with a capitol letter`),
);

const fstCharNum = E.fromPredicate(
  (s: string) => /^[0-9]/.test(s),
  () => RNEA.of(`must BEGIN with a number`),
);

const secretcode = (secret: RegExp) =>
  E.fromPredicate(
    (s: string) => secret.test(s),
    () => RNEA.of(`secret code MUST be valid`),
  );

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

const validateTitle = (item: TodoItem) =>
  pipe(
    title.get(item),
    Or(
      secretcode(/wombat/),
      And(notEmpty, min(10), max(20), Or(fstCharNum, fstCharCap)),
    ),
  );

export const validate = (v: TodoItem) =>
  pipe(
    v,
    validateTitle,
    E.map(() => v),
  );
