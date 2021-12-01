import React from "react";

export const useSwitch = (initial = false) => {
  const [bool, setBool] = React.useState(initial);
  const toggle = React.useCallback(() => setBool((s) => !s), []);
  const switchOn = React.useCallback(() => setBool(true), []);
  const switchOff = React.useCallback(() => setBool(false), []);

  return React.useMemo(
    () => ({
      on: bool === true,
      off: bool === false,
      toggle,
      switchOff,
      switchOn,
    }),
    [bool, toggle, switchOff, switchOn],
  );
};
