import React from "react";
import { getUUID } from "../api";
import { RD, pipe, E } from "../deps";
import { useEnv } from "../EnvContext";
import { NonEmptyString } from "io-ts-types";
import { getDefaultItem, newItemId } from "../helpers";

export const useDefaultTodoItem = (props: {
  immidiate: boolean;
  setRd: (x: RD.RemoteData<any, any>) => void;
}) => {
  const env = useEnv();

  const request = () => {
    props.setRd(RD.pending);
    getUUID(env)().then(
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
                NonEmptyString.decode,
                E.fold(
                  () => {
                    return RD.failure(`Failed to decode UUID: "${s}"`);
                  },
                  (s) => {
                    return RD.success(pipe(s, newItemId, getDefaultItem));
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
