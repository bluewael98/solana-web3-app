"use client";
import { useContext } from "react";

import { GlobalContext } from "@/state/global";

export const useGlobalState: any = () => {
  return useContext(GlobalContext);
};
