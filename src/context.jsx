import { createContext, useContext } from "react";
export const C = createContext();
export const useCopy = () => useContext(C);
