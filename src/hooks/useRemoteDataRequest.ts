import React from "react";
import { TE, RD, flow, pipe, E, IOTS, RTE } from "../deps";
import { useEnv } from "../EnvContext";
import { HttpEnv } from "../env";

export const useRemoteDataRequest = <A, B, C, D, E extends unknown[]>(props: {
  request: RTE.ReaderTaskEither<
    HttpEnv,
    never,
    (...params: E) => TE.TaskEither<RD.RemoteFailure<A>, RD.RemoteSuccess<B>>
  >;
  setRemoteData: (x: RD.RemoteData<A, C>) => void;
  codec: IOTS.Decoder<B, D>;
  onDecodeSuccess: (x: D) => C;
  onDecodeFailure: (x: B) => A;
}) => {
  const env = useEnv();

  const request = React.useCallback(
    (...params: E) => {
      props.setRemoteData(RD.pending);
      const run = flow(
        pipe(
          props.request,
          RTE.chainTaskEitherK((fn) => fn(...params)),
          RTE.map(
            RD.chain((s) => {
              return pipe(
                s,
                props.codec.decode,
                E.fold(
                  () => {
                    // failed to decode
                    return RD.failure(props.onDecodeFailure(s));
                  },
                  (d) => {
                    return RD.success(pipe(props.onDecodeSuccess(d)));
                  },
                ),
              );
            }),
          ),
          RTE.bimap(props.setRemoteData, props.setRemoteData),
        ),
      );

      run(env)();
    },
    [props, env],
  );

  return React.useMemo(() => ({ request } as const), [request]);
};
