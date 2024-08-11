import { createContext, useContext } from 'react';
import { useState } from 'react';

const ChatReceiverContext=createContext();


const ChatReceiverProvider=({children})=>{
    const [receiver,setReceiver]=useState("");


    return (
        <ChatReceiverContext.Provider value={[receiver,setReceiver]}>
            {children}
        </ChatReceiverContext.Provider>
     )
}

const useReceiver=()=>useContext(ChatReceiverContext);
export  {useReceiver,ChatReceiverProvider}