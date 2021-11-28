import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "./deps";
import { HttpEnv, UUIDv4_URL } from "./env";
import { logWithEnv } from "./utils";

export const getUUID = pipe(
  RTE.ask<HttpEnv>(),
  RTE.chainTaskEitherK((env) => {
    logWithEnv("debug").info(env);
    return TE.tryCatch(
      async () => {
        return env.client.get(UUIDv4_URL).then((response) => response.text());
      },
      (reason) => {
        const message = `Failed to fetch ${UUIDv4_URL}: ${reason}`;
        logWithEnv("debug").error(message);
        return message;
      },
    );
  }),
);
