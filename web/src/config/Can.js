import { createCanBoundTo } from "@casl/react"
import ability from "./ability"

export default createCanBoundTo(ability)

// import { createContext } from 'react';
// import { createContextualCan } from '@casl/react';

// const AbilityContext = createContext();
// export const Can = createContextualCan(AbilityContext.Consumer);