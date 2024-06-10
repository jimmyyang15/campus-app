"use client"

import { Session, User } from "lucia";
import React, { createContext, useContext } from "react";

// interface SessionProviderProps {
//   user: User;
// }

const SessionContext = createContext<User>({} as User)

const SessionProvider = ({ children, value }:{
    children:React.ReactNode,
    value:User
}) => {
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
    const sessionContext = useContext(SessionContext);
    if(!sessionContext) {
        throw new Error("useSession must be used within a SessionProvider")
    }

    return sessionContext;
}

export default SessionProvider;
