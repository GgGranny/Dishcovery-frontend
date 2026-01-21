import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client = null;

export const connect = (onMessageReceived, communityId) => {
    if (client && client.connected) return;
    // const socket = new SockJS("http://localhost:8080/ws");
    client = new Client({
        // webSocketFactory: socket,
        brokerURL: "ws://localhost:8080/ws",
        connectHeaders: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        onConnect: () => {
            console.log("✅ Connected");
            client.subscribe(`/topic/public/${communityId}`, (message) => {
                const msg = JSON.parse(message.body);
                console.log(msg)
                onMessageReceived(msg.data, communityId);
            });

        },

        onStompError: (frame) => {
            console.error("STOMP Error:", frame.body);
        },
    });

    client.activate();
};

export const sendMsg = (data, communityId) => {
    if (!client || !client.connected) {
        console.error("WebSocket not connected");
        return;
    }
    client.publish({
        destination: `/app/sendMessage/${communityId}`,
        body: JSON.stringify(data),
    });
};

export const sendFiles = (payload, communityId) => {
    if (!payload) return;
    console.log(communityId)
    client.publish({
        destination: `/app/sendFiles/${communityId}`,
        body: JSON.stringify(payload)
    })
}
