/* eslint-disable react/prop-types */
import React, { useState } from 'react';

export const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  return <AuthContext.Provider value={{ token, setToken }}>{children}</AuthContext.Provider>;
}
