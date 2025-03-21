"use client"
import { useEffect, useState } from "react";
import dotenv from "dotenv";
import { Canvas } from "./Canvas";
dotenv.config();

export function RoomCanvas({ roomName }: { roomName: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const ws_url = process.env.NEXT_PUBLIC_WS_URL;

    if (!ws_url) {
        console.log("Internal server error while fetching the wsurl");
        return <div>Failed to fetch WebSocket URL.</div>;
    }

    useEffect(() => {
        const ws = new WebSocket(`${ws_url}?token=Bearer eyJhbGciOiJIUzI1NiJ9.YWthc2gx.m8ev70nbyJNanotPV6EbzqicT3JEOepFF3B7DsB82Fo`);

        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "subscribe",
                roomName,
            }));
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close(); 
            }
        };
    }, [roomName, ws_url]);

    if (!socket) {
        return <div className="text-white text-5xl w-screen h-screen bg-black flex justify-center items-center ">Connecting to the server...</div>;
    }

    return <Canvas roomName={roomName} socket={socket} />;
}
