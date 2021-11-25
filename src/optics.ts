import { iso, prism } from "newtype-ts";
import type { ItemId } from "./newtypes";
import { itemC, itemIdC } from "./codecs";
import * as tt from "io-ts-types";
import type { NonEmptyString } from "io-ts-types";
import * as t from "io-ts";

import { monocle } from "./deps";
import { TodoItem } from "./types";

const { Lens } = monocle;

export const itemIdIso = iso<ItemId>();
export const itemIdPrism = prism<ItemId>(itemIdC.is);

export const lenses = tt.getLenses(itemC);
