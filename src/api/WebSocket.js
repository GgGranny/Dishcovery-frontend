import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client = null;

export const connect = (onMessageReceived) => {
    client = new Client({
        brokerURL: "ws://localhost:8080/ws",
        onConnect: () => {
            console.log("✅ Connected");

            // Subscribe
            client.subscribe("/topic/public", (message) => {
                const msg = JSON.parse(message.body);
                onMessageReceived(msg);
            });
        },

        onStompError: (frame) => {
            console.error(frame.body);
        }
    });

    client.activate();
};


export const sendMsg = (message, username) => {
    client.publish({
        destination: "/app/sendMessage",
        body: JSON.stringify({
            sender: username,
            type: "CHAT",
            content: message
        })
    })
}
