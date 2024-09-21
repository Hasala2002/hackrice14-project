import { useAuth0 } from '@auth0/auth0-react'
import { createContext, useContext, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () =>{
    return useContext(AuthContext)
} 

export const AuthProvider = ({children}) => {

    const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();

    useEffect(()=>{
        console.log(user, isAuthenticated)
    },[user, isAuthenticated])

    const value = {
        user,
        isAuthenticated,
        isLoading,
        loginWithRedirect,
        logout
    } 

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )


}