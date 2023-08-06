import React from "react";

import { GlobalContext } from "@/state/global";

export const useGlobalState = () => {
  return React.useContext(GlobalContext);
};
