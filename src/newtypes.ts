/**
 * Thinking in types. Let the types guide you.
 *
 * Since TypeScript uses structural typing there is no way to distinguish
 * one type from another whenever they both satisfy the same interface.
 */
import * as tt from "io-ts-types";
import { Newtype } from "newtype-ts";

/**
 * string -> Item
 */
export interface ItemId
  extends Newtype<{ readonly ItemId: unique symbol }, tt.NonEmptyString> {}
