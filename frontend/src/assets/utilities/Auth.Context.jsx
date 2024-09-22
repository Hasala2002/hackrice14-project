import { useAuth0 } from "@auth0/auth0-react";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } =
    useAuth0();

  const [collided, setCollided] = useState(false);
  const [collidedAssign, setCollidedAssign] = useState(false);

  useEffect(() => {
    console.log(user, isAuthenticated);
  }, [user, isAuthenticated]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    collided,
    setCollided,
    collidedAssign,
    setCollidedAssign,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
