"use client"

import { Session, User } from "lucia";
import React, { createContext, useContext } from "react";

interface SessionProviderProps {
  user: User;
  session: Session;
}

const SessionContext = createContext<SessionProviderProps>(
  {} as SessionProviderProps,
);

const SessionProvider = ({ children, value }:{
    children:React.ReactNode,
    value:SessionProviderProps
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
