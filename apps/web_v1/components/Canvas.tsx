import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";

export function Canvas ({roomName ,socket}:{roomName : string, socket : WebSocket}) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({width: 0, height : 0})

    useEffect(() => {

        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (!canvasRef.current ) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        initDraw(canvas, ctx, dimensions, roomName, socket)
    }, [dimensions]);

    return(
        <canvas ref={canvasRef}  width={dimensions.width} height={dimensions.height} />
    );

}