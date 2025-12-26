import { useState } from "react"
import { connect, sendMsg } from "../../api/WebSocket";

const Chat = () => {
    const [data, setData] = useState("");
    const [message, setMessage] = useState("");
    const handleOnchange = (e) => {
        setData(e.target.value);
    }
    const handleSubscription = (e) => {
        e.preventDefault();
        const obj = connect(onMessageReceived);
        console.log(obj);
    }

    const sendMessage = () => {
        sendMsg(message, data);
    }

    const onMessageReceived = (response) => {
        console.log(response)
    }
    return (
        <div>
            <h1>THis is chat</h1>
            <input type="text" onChange={handleOnchange} value={data} className="bg-gray-500 text-white" />
            <br />
            <button className="bg-blue-400 px-4 text-gray-200 rounded py-2" onClick={handleSubscription}>Join</button>
            <br />
            <input type="text" onChange={(e) => setMessage(e.target.value)} value={message} className="bg-gray-500 text-white" />
            <button className="bg-blue-400 px-4 text-gray-200 rounded py-2" onClick={sendMessage}>Send</button>
        </div>
    )
}
export default Chat;