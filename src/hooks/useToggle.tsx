import React from "react";

export const useToggle = (initial = false) => {
  const [bool, setBool] = React.useState(initial);
  const toggle = React.useCallback(() => setBool((s) => !s), []);
  const toggleOn = React.useCallback(() => setBool(true), []);
  const toggleOff = React.useCallback(() => setBool(false), []);

  return React.useMemo(
    () => ({
      on: bool === true,
      off: bool === false,
      toggle,
      toggleOff,
      toggleOn,
    }),
    [bool, toggle, toggleOff, toggleOn],
  );
};
