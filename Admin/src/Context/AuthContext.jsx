import { createContext, useState } from "react";

export const AuthContext=createContext()

export default function AuthContextProvider({children}) {
    const tk=localStorage.getItem('token')
    const [token,setToken]=useState(tk)
    const handleToken=(x)=>{
        if(x){
            localStorage.setItem('token',x)
        }else{
            localStorage.clear()
        }
        setToken(x)
    }
  return (
    <AuthContext.Provider value={{token,handleToken}}>
        {children}
    </AuthContext.Provider>
  )
}

