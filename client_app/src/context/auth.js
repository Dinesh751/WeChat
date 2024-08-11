import { createContext, useContext, useEffect } from 'react';
import { useState } from 'react';

const AuthContext=createContext();

 const AuthProvider=({children})=>{
     const [auth,setAuth]=useState({
        user:null,
        token:""
     })

     useEffect(()=>{
        
     const auth= localStorage.getItem("auth")
     const data=JSON.parse(auth);
     setAuth({...auth,user:data?.user,token:data?.token})
     },[])

     return (
        <AuthContext.Provider value={[auth,setAuth]}>
            {children}
        </AuthContext.Provider>
     )
}

const useAuth=()=>useContext(AuthContext);
export  {useAuth,AuthProvider}