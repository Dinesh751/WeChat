import React from 'react'
import "./Auth.css"
import { useState} from 'react';
import axios from "axios"
import { authURL } from '../../local.setting';
import {Toaster} from "react-hot-toast"
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/auth';


const Auth = () => {

  const [userName,setUserName]=useState("");
  const [password,setPassword]=useState("");
  const navigate=useNavigate();
  const [auth,setAuth]=useAuth()




   const handleSignUp=async (e)=>{
    e.preventDefault();
       try{

      const {data}= await axios.post(`${authURL}/v1/auth/signup`,{
        userName,
        password
      })
      console.log(data)
     
       if(data.success){
        navigate("/chat")
        setTimeout(()=>{toast.success(data.message)},1000)
        setAuth({
          user:data.user,
          token:data.token
        })
        localStorage.setItem("auth",JSON.stringify(data));
        
       
       }else{
        toast.error(data.message)
       }

       }catch(err){
        console.log(err)
       }
   }

   const handleLogin=async (e)=>{
    e.preventDefault();
    try{

      const {data}= await axios.post(`${authURL}/v1/auth/login`,{
        userName,
        password
      })
      console.log(data)
     
       if(data.success){
        navigate("/chat")
        setTimeout(()=>{toast.success(data.message)},1000)
        setAuth({
          user:data.user,
          token:data.token
        })
        localStorage.setItem("auth",JSON.stringify(data));
       
        
       }else{
        toast.error(data.message)
       }

   

    }catch(err){
     console.log(err)
    }
}

  return (
    <>
     
    <div className="loginForm">
         <div className="container">
            
            <form>
              <h3 className="form-title">We Chat </h3>

              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" name="userName"  onChange={(e)=>{setUserName(e.target.value)}} aria-describedby="emailHelp" placeholder="Enter email"/>
              </div>

              <div className="form-group">
                <label htmlFor="exampleInputPassword">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword" name="password" aria-describedby="passwordHelp"  onChange={(e)=>{setPassword(e.target.value)}}  placeholder="Enter password"/>
              </div>

              <div className="form-button">
                <button type="submit" className="btn "  onClick={handleSignUp}>SignUp</button>  
                <button type="submit" className="btn "  onClick={handleLogin}>Login</button>
              </div>

             

            </form>
         </div>
    </div>
    <Toaster/>
    </>
  )
}

export default Auth