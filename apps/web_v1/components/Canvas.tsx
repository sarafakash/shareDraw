import { useEffect, useRef, useState } from "react";
import { Draw } from "../draw/draw"

export function Canvas ({roomName ,socket}:{roomName : string, socket : WebSocket}) {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawRef = useRef<Draw | null>(null);

    useEffect(() => {
        if (!canvasRef.current ) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        if(canvas) {
            drawRef.current = new Draw(canvas, roomName, socket, ctx);


            return ()=> {
                drawRef.current?.destroy();
            }
        }

    }, [roomName, socket]);



    return(
        <div style={{
            height: "100vh",
            overflow: "hidden"
        }}>
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        </div>
    );

}