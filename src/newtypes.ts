/**
 * Thinking in types. Let the types guide you.
 *
 * Since TypeScript uses structural typing there is no way to distinguish
 * one type from another whenever they both satisfy the same interface.
 */
import * as tt from "io-ts-types";
import { Newtype } from "newtype-ts";

/**
 * A Newtype is more strict than a Branded type. While a branded type may be coerced with a single as cast  `as T` a
 * NewType requires two as casts `as unknown as T`. _As_ a result newtypes require specialized helpers. The rule of thumb
 * is to use a newtype whenever it doesn't make sense to use the type as it's underlying value. For example, the Id will never be
 * treated as a string with `concat` or other string methods applied to it.
 */
export interface ItemId
  extends Newtype<{ readonly ItemId: unique symbol }, tt.NonEmptyString> {}
