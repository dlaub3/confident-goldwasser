import React from "react";
import { RD, pipe, E, IOTS } from "../deps";
import { useEnv } from "../EnvContext";
import { HttpEnv } from "../env";
import { TaskEither } from "fp-ts/lib/TaskEither";

export const useRemoteData = <A, B, C, D>(props: {
  request: (r: HttpEnv) => TaskEither<RD.RemoteFailure<A>, RD.RemoteSuccess<B>>;
  immidiate?: boolean;
  setRd: (x: RD.RemoteData<A, C>) => void;
  onSuccess: (x: D) => C;
  onFailure: (x: B) => A;
  codec: IOTS.Decoder<B, D>;
}) => {
  const env = useEnv();

  const request = () => {
    props.setRd(RD.pending);
    props
      .request(env)()
      .then(
        E.fold(
          (x) => {
            props.setRd(x);
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
                      return RD.failure(props.onFailure(s));
                    },
                    (d) => {
                      return RD.success(pipe(props.onSuccess(d)));
                    },
                  ),
                );
              }),
              (rd) => {
                setTimeout(() => {
                  props.setRd(rd);
                }, 300);
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
