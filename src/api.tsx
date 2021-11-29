import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe, RD } from "./deps";
import { HttpEnv, UUIDv4_URL } from "./env";
import { runWithEnv } from "./utils";

export const getUUID = pipe(
  RTE.ask<HttpEnv>(),
  RTE.chainTaskEitherK((env) => {
    runWithEnv("debug", () => console.info(env));
    return TE.tryCatch<RD.RemoteFailure<string>, RD.RemoteSuccess<string>>(
      async () => {
        return env.client
          .get(UUIDv4_URL)
          .then((response) => response.text())
          .then((x) => RD.success(x) as RD.RemoteSuccess<string>);
      },
      (reason) => {
        const message = `Failed to fetch ${UUIDv4_URL}: ${reason}`;
        runWithEnv("debug", () => console.error(message));
        return RD.failure(message) as RD.RemoteFailure<string>;
      },
    );
  }),
);
