import { createContext, useContext, useState } from 'react';

const ChatReceiverContext = createContext(null); // Added default value

const ChatReceiverProvider = ({ children }) => {
    const [receiver, setReceiver] = useState("");

    return (
        <ChatReceiverContext.Provider value={[receiver, setReceiver]}>
            {children}
        </ChatReceiverContext.Provider>
    );
};

const useReceiver = () => {
    const context = useContext(ChatReceiverContext);
    if (!context) {
        throw new Error("useReceiver must be used within a ChatReceiverProvider");
    }
    return context;
};

export { useReceiver, ChatReceiverProvider };