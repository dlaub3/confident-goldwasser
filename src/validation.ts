import { Semi, E, pipe, RNEA, Str, Alt, Apl, Mn } from "./deps";
import { title } from "./optics";
import { TodoItem } from "./types";
import { tap } from "./utils";

export const max = (maxLength: number) =>
  E.fromPredicate(
    (s: string) => s.length <= maxLength,
    () => `must BE LESS than ${maxLength} characters`,
  );

export const min = (minLength: number) =>
  E.fromPredicate(
    (s: string) => s.length >= minLength,
    () => `must HAVE at least ${minLength} characters`,
  );

export const notEmpty = E.fromPredicate(
  (s: string) => s !== "",
  () => `must NOT BE empty`,
);

export const fstCharCap = E.fromPredicate(
  (s: string) => /^[A-Z]/.test(s),
  () => `must BEGIN with a capitol letter`,
);

export const fstCharNum = E.fromPredicate(
  <S extends string>(s: S) => /^[0-9]/.test(s),
  () => `must BEGIN with a number`,
);

export const secretcode = (secret: RegExp) =>
  E.fromPredicate(
    (s: string) => secret.test(s),
    () => `secret code MUST be valid`,
  );

type Validation = (s: string) => E.Either<string, string>;

const And =
  <T extends Validation>(...xs: RNEA.ReadonlyNonEmptyArray<T>) =>
  (s: string) => {
    const ApAnd = E.getApplicativeValidation(Str.Semigroup);

    return pipe(
      xs,
      RNEA.ap([s]),
      Mn.concatAll(Apl.getApplicativeMonoid(ApAnd)(Str.Monoid)),
    );
  };

const Or =
  <T extends Validation>(first: T, ...rest: RNEA.ReadonlyNonEmptyArray<T>) =>
  (s: string) => {
    const AltOr = E.getAltValidation(Semi.intercalate(" OR ")(Str.Semigroup));
    return Alt.altAll(AltOr)(first(s))(pipe(rest, RNEA.ap([s])));
  };

const validateTitle = (item: TodoItem) =>
  pipe(title.get(item), And(notEmpty, min(10), max(20), Or(min(9), max(1))));

export const validate = (v: TodoItem) =>
  pipe(
    v,
    validateTitle,
    tap("validate"),
    E.map(() => v),
  );
