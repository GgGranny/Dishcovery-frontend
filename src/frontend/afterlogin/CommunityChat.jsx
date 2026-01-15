import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMessages } from "../../api/Community";
import { connect, sendFiles, sendMsg } from "../../api/WebSocket";
import { ImAttachment } from "react-icons/im";
import { FaFileAlt } from "react-icons/fa";

const CommunityChat = () => {
    const [message, setMessage] = useState("");
    const [messageData, setMessageData] = useState([]);
    const [scrollPos, setScrollPos] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);
    const [isMessageLoading, setIsMessageLoading] = useState(false);
    const [fileUrl, setFileUrl] = useState("");
    const messageScrollRef = useRef(null);
    const shouldAutoScroll = useRef(true);
    const fileRef = useRef(null);
    const isConnected = useRef(false);
    const params = useParams();
    const [filePayload, setFilePayload] = useState({
        type: "",
        content: "",
        sender: "",
        file: null,
        fileName: null,
        fileSize: null,
        fileType: null
    })

    const onMessageReceived = (message) => {
        setMessageData(prev => {
            if (prev.some(msg => msg.chatId === Number(message.chatId))) return prev;
            return [...prev, message]
        });
        console.log("msg after received: ", message)
    }

    useLayoutEffect(() => {
        if (messageScrollRef.current && shouldAutoScroll.current) {
            messageScrollRef.current.scrollTop = messageScrollRef.current.scrollHeight;
        }
    }, [messageData.length])

    useEffect(() => {
        if (isConnected.current) return;
        isConnected.current = true;
        const disconnect = connect(onMessageReceived, params.id);
        async function fetch() {
            const response = await fetchMessages(params.id, page, pageSize);
            const newData = Array.isArray(response) ? response : [];
            console.log("this is response:", response);
            setMessageData(newData.reverse());
        }
        fetch();
        return () => {
            isConnected.current = false;
            disconnect?.();
        }
    }, [params.id]);

    useEffect(() => {
        console.log(messageData);
    }, [])
    const handleMessageSent = async () => {
        const payload = {
            content: message,
            type: "CHAT",
            sender: localStorage.getItem("username"),
        };
        sendMsg(payload, params.id);
        shouldAutoScroll.current = true;
        setMessage("");
    };

    const handleScroll = async (event) => {
        const container = event.target;

        if (isMessageLoading) return;

        if (container.scrollTop <= 10) {
            setIsMessageLoading(true);
            const prevScrollHeight = container.scrollHeight;
            try {
                const response = await fetchMessages(
                    params.id,
                    page + 1,
                    pageSize
                );
                const newResponse = Array.isArray(response) ? response : [];
                setMessageData(prev => {
                    const existingIds = new Set(prev.map(m => m.chatId));
                    const filtered = newResponse.filter(
                        m => !existingIds.has(m.chatId)
                    );
                    if (filtered.length > 0) {
                        setPage(p => p + 1);
                        shouldAutoScroll.current = false;
                        return [...filtered, ...prev];
                    }
                    return prev;
                });
                requestAnimationFrame(() => {
                    const newScrollHeight = container.scrollHeight;
                    container.scrollTop =
                        newScrollHeight - prevScrollHeight;
                });
                setIsMessageLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
    };
    const handleFileChange = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;
        const base64File = await toBase64(file);
        if (base64File) {
            const cleanBase64File = base64File.split(",")[1];
            console.log(cleanBase64File)
            const payload = {
                type: "FILE",
                content: "this is tets",
                sender: localStorage.getItem("username"),
                file: cleanBase64File,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type
            }
            // setFilePayload(prev => ({ ...prev, ...payload }));
            sendFiles(payload, params.id);
        }
        console.log(file);
    }
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject("filed to convert file");
    })
    const openFile = () => {
        fileRef.current?.click();
    }

    const decodeBase64 = (data, fileType) => {
        const decodedData = atob(data);
        const byteNumber = new Array(decodedData.length);
        for (let i = 0; i <= decodedData.length; i++) {
            byteNumber[i] = decodedData.charCodeAt(i);
        }
        const blob = new Blob([new Uint8Array(byteNumber)], { type: fileType });
        return URL.createObjectURL(blob);
    }

    return (
        <div className="flex h-screen bg-gray-100">

            <div className="flex flex-col flex-1">
                {/* Header */}
                <div className="bg-white border-b p-4">
                    <h1 className="text-xl font-semibold">Java Devs</h1>
                </div>

                {/* Messages */}
                <div ref={messageScrollRef} className="messages-container flex-1 overflow-y-auto p-4 space-y-3" onScroll={handleScroll}>
                    {isMessageLoading && (
                        <div className="text-center">Loading ....</div>
                    )}
                    {/* Received message */}
                    {messageData.map((message) => {
                        const isOwnMessage = message.senderId === Number(localStorage.getItem("userid"));
                        if (message.type === "CHAT" || message.type === null) {
                            return isOwnMessage ? (
                                <div className="flex justify-end" key={message.chatId}>
                                    <div className="bg-blue-500 text-white p-3 rounded-lg shadow max-w-sm">
                                        <p className="text-sm">{message.content}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-2" key={message.chatId}>
                                    <div className="bg-white p-3 rounded-lg shadow max-w-sm">
                                        <p className="text-sm font-semibold">
                                            {message.sender}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {message.content}
                                        </p>
                                    </div>
                                </div>
                            );
                        }
                        if (message.type === "FILE") {
                            const fType = message.fileType;
                            const url = decodeBase64(message.fileData, message.fileType);
                            // setFileUrl(url);
                            if (isOwnMessage) {
                                if (!message.content || !message.fileData) return null;
                                return (
                                    <div className="flex justify-end" key={message.chatId}>
                                        <div className="bg-blue-500 text-white p-3 rounded-lg shadow max-w-sm">
                                            {message.content && (
                                                <p className="text-sm">{message.content}</p>
                                            )}
                                            {fType.startsWith("image/") && (
                                                <a
                                                    href={url}
                                                    download={message.fileName}
                                                    className="block mt-2 underline"
                                                >
                                                    <img src={url} alt={message.fileName} className="" />
                                                </a>
                                            )}
                                            {fType.startsWith("application/") && (
                                                <a
                                                    href={url}
                                                    download={message.fileName}
                                                    className="block mt-2 underline"
                                                >
                                                    <div className="flex items-top gap-3">
                                                        <FaFileAlt size="2.5rem" /> {message.fileName.length > 30 ? message.fileName.slice(0, 29) + "...." : message.fileName}
                                                    </div>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div className="flex items-start gap-2" key={message.chatId}>
                                    <div className="bg-white p-3 rounded-lg shadow max-w-sm">
                                        <p className="text-sm font-semibold">{message.sender}</p>
                                        <p className="text-sm text-gray-700">{message.content}</p>
                                        {fType.startsWith("image/") && (
                                            <a
                                                href={url}
                                                download={message.fileName}
                                                className="block mt-2 underline"
                                            >
                                                <img src={url} alt={message.fileName} />
                                            </a>
                                        )}
                                        {fType.startsWith("application/") && (
                                            <a
                                                href={url}
                                                download={message.fileName}
                                                className="block mt-2 underline"
                                            >
                                                <div className="flex items-top gap-3">
                                                    <FaFileAlt size="2.5rem" /><span className="text-wrap"> {message.fileName.length > 30 ? message.fileName.slice(0, 29) + "...." : message.fileName} </span>
                                                </div>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        }

                    })}

                </div>

                {/* Input */}
                <div className="bg-white border-t p-4">
                    <form className="flex gap-2 items-end">
                        {/* {!filePayload.file && (<input
                            type="text"
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />)} */}
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {/* {filePayload.fileName && (
                            <div className="flex flex-col w-full">
                                <img src={decodeBase64(filePayload.file, filePayload.fileType)} className="h-20 w-20 rounded-md mb-2" />
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        )} */}
                        <div className="flex items-center gap-2">
                            <div className="cursor-pointer">
                                <input type="file" className="hidden" ref={fileRef} onChange={handleFileChange} multiple />
                                <span onClick={openFile} ><ImAttachment size="20px" /></span>
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
                                onClick={handleMessageSent}
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
};

export default CommunityChat;
