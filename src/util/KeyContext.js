import { createContext } from "react";

export const KeyContext = createContext(() => (console.log('default context')));