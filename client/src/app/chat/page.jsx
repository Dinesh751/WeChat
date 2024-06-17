'use client'
import React from 'react'
import  {useState, useEffect} from 'react';
import { serverLink } from '../serverLink';
import  io  from 'socket.io-client';
import { useAuthStore } from '../zustand/useAuthStore';
import ChatUsers from '../components/chatUsers';
import { useChatReceiverStore } from '../zustand/userChatReceiverStore';


const Chat = () => {

const [msg,setMsg]= useState("")
const [socket , setSocket] = useState(null)
const [msgs, setMsgs] = useState([]);
const {authName}=useAuthStore();
const {chatReceiver}=useChatReceiverStore()



  useEffect(() => {
         // Establish WebSocket connection
         const newSocket = io(serverLink,{
            query:{
              userName:authName
            }
         });
         setSocket(newSocket);
   
   
         // Listen for incoming msgs
         newSocket.on('chat msg', msg => {
             console.log('received msg on client ' + msg);
             setMsgs(prevMsgs => [...prevMsgs, { text: msg, sentByCurrUser: false }]);
         });
   
    return ()=> newSocket.close()
  }, []);





const sendMsg= (e)=>{
  e.preventDefault();
  const messageToBeSent={
    sender:authName,
    receiver:chatReceiver,
    textMessage:msg
  }
  if(socket){
     socket.emit('chat msg',messageToBeSent)
     setMsgs(prevMsgs => [...prevMsgs, { text: msg, sentByCurrUser: true }]);
    setMsg("")
    console.log(msgs)
  }
 
  
}


  return (
    <div className='flex h-screen divide-x-4'>
       <div className='w-1/5'>
           <ChatUsers/>
       </div>
	
       <div className='h-screen flex flex-col w-full'>
       <h1>
           {authName} Chatting with {chatReceiver}
        </h1>
        <div className='msgs-container h-4/5 '>
            {msgs.map((msg, index) => (
             
                <div key={index} className={` m-6 ${msg.sentByCurrUser ? 'text-right' : 'text-left'}`}>
                    <span className={` ${msg.sentByCurrUser ? 'bg-blue-200' : 'bg-green-200'} p-3 rounded-lg`}>
                         {msg.text}
                     </span>
                </div>
                
            ))}
        </div>
        <div className='h-1/5 flex items-center justify-center'>
            <form onSubmit={sendMsg} className="w-4/5"> 
                <div className="relative"> 
                    <input type="text"
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                            placeholder="Type your text here"
                            required
                            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  />
                    <button type="submit"
                            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Send
                    </button>
                </div>
            </form>
        </div>
    </div>



</div>




    
  )
  
}

export default Chat