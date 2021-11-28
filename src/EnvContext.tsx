import React from "react";
import { HttpEnv } from "./env";

const EnvContext = React.createContext<HttpEnv | undefined>(undefined);

export const EnvContextProvider = (props: {
  children: JSX.Element;
  value: HttpEnv | undefined;
}) => {
  return (
    <EnvContext.Provider value={props.value}>
      {props.children}
    </EnvContext.Provider>
  );
};

export const useEnv = () => {
  const context = React.useContext(EnvContext);
  if (context === undefined) {
    throw Error("Missing EnvContextProvider");
  }
  return context;
};
