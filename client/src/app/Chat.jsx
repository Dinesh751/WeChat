'use client'
import React from 'react'
import  {useState, useEffect} from 'react';
import  io  from 'socket.io-client';



const Chat = () => {

const [msg,setMsg]= useState("")
const [socket , setSocket] = useState(null)


  useEffect(() => {
    const newSocket= io("http://localhost:8050");

    setSocket(newSocket)

    return ()=> socket.close()
  }, []);



const handleOnchange=(e)=>{
    setMsg(e.target.value)
}

const handleOnClick=(e)=>{
  e.preventDefault();
  if(socket){
    socket.emit('chat msg',msg)
    setMsg('')
  }
  
}


  return (
    <>

    
    <input type="text" placeholder="Enter Message"value={msg} onChange={handleOnchange}/>
    <button type="submit"onClick={handleOnClick}>Send</button>

   
    


    
    </>
  )
}

export default Chat