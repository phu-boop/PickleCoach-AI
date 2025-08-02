import AppRoutes from "./routes/AppRoutes";
import ChatBox from './components/chat/ChatBox';
import ChatBox2 from './components/chat/ChatBox2';
import "./styles/App.css";
function App() {
    return (
        <>
            <AppRoutes />
            {/* <ChatBox /> */}
            <ChatBox2 />
        </>
    );
}
export default App;