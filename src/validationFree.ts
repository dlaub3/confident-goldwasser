import { Apl, Semi, E, pipe, RNEA, Str, Mn, Alt } from "./deps";
import { title } from "./optics";
import { TodoItem } from "./types";

export const max = (maxLength: number) =>
  E.fromPredicate(
    (s: string) => s.length <= maxLength,
    () => RNEA.of(`must BE LESS than ${maxLength} characters`),
  );

export const min = (minLength: number) =>
  E.fromPredicate(
    (s: string) => s.length >= minLength,
    () => RNEA.of(`must HAVE at least ${minLength} characters`),
  );

export const notEmpty = E.fromPredicate(
  (s: string) => s !== "",
  () => RNEA.of(`must NOT BE empty`),
);

export const fstCharCap = E.fromPredicate(
  (s: string) => /^[A-Z]/.test(s),
  () => RNEA.of(`must BEGIN with a capitol letter`),
);

export const fstCharNum = E.fromPredicate(
  (s: string) => /^[0-9]/.test(s),
  () => RNEA.of(`must BEGIN with a number`),
);

export const secretcode = (secret: RegExp) =>
  E.fromPredicate(
    (s: string) => secret.test(s),
    () => RNEA.of(`secret code MUST be valid`),
  );

const getMonoid = <A>(
  { concat }: Semi.Semigroup<A>,
  empty: A,
): Mn.Monoid<A> => ({
  concat,
  empty,
});

type FreeValidation = (
  s: string,
) => E.Either<RNEA.ReadonlyNonEmptyArray<string>, string>;

const And =
  <T extends FreeValidation>(...xs: RNEA.ReadonlyNonEmptyArray<T>) =>
  (s: string) => {
    const ApAnd = E.getApplicativeValidation(RNEA.getSemigroup<string>());

    return pipe(
      xs,
      RNEA.ap([s]),
      Mn.concatAll(Apl.getApplicativeMonoid(ApAnd)(Str.Monoid)),
    );
  };

const Or =
  <T extends FreeValidation>(
    first: T,
    ...rest: RNEA.ReadonlyNonEmptyArray<T>
  ) =>
  (s: string) => {
    const AltAnd = E.getAltValidation(RNEA.getSemigroup<string>());
    const SemiOr = Semi.intercalate(" OR ")(Str.Semigroup);

    return pipe(
      Alt.altAll(AltAnd)(first(s))(pipe(rest, RNEA.ap([s]))),
      E.mapLeft(([first, ...rest]: RNEA.ReadonlyNonEmptyArray<string>) => {
        return pipe(rest, Mn.concatAll(getMonoid(SemiOr, first)));
      }),
      E.mapLeft(RNEA.of),
    );
  };

const between0and10 = And(min(1), max(9));

const validateTitle = (item: TodoItem) =>
  pipe(
    title.get(item),
    And(
      And(fstCharCap, fstCharNum),
      And(notEmpty, min(10), max(20), between0and10),
      Or(secretcode(/wombat/), And(fstCharCap, fstCharNum)),
    ),
  );

export const validate = (v: TodoItem) =>
  pipe(
    v,
    validateTitle,
    E.map(() => v),
  );
