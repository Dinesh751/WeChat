import { Route,Routes } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import ChatPage from "./pages/chatPage/ChatPage"


function App() {
  return (
   <Routes>
      <Route path="/" element={<Auth/>} />
      <Route path="/chat" element={<ChatPage/>} />
   </Routes>
  );
}

export default App;
