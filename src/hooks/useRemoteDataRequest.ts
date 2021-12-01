import React from "react";
import { TE, RD, pipe, E, IOTS } from "../deps";
import { useEnv } from "../EnvContext";
import { HttpEnv } from "../env";

export const useRemoteDataRequest = <A, B, C, D>(props: {
  request: (
    r: HttpEnv,
  ) => TE.TaskEither<RD.RemoteFailure<A>, RD.RemoteSuccess<B>>;
  immidiate?: boolean;
  setRemoteData: (x: RD.RemoteData<A, C>) => void;
  codec: IOTS.Decoder<B, D>;
  onDevodeSuccess: (x: D) => C;
  onDecodeFailure: (x: B) => A;
}) => {
  const env = useEnv();

  const request = () => {
    props.setRemoteData(RD.pending);
    props
      .request(env)()
      .then(
        E.fold(
          (x) => {
            // failed to fetch
            props.setRemoteData(x);
          },
          (x) => {
            pipe(
              x,
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
                      return RD.success(pipe(props.onDevodeSuccess(d)));
                    },
                  ),
                );
              }),
              (rd) => {
                props.setRemoteData(rd);
              },
            );
          },
        ),
      );
  };

  React.useEffect(() => {
    if (props.immidiate) {
      request();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [request] as const;
};
