"use client";
import { useEffect, useRef, useState } from "react";

export default function Canvas () {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({width: 0, height : 0})


    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener("resize", handleResize);
        handleResize(); // Set initial size
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (!canvasRef.current ) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);
        ctx.strokeStyle = "white";

        let clicked = false;
        let startX = 0;
        let startY = 0;

        const handleMouseDown = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            clicked = true;
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;
        };

        const handleMouseUp = () => {
            clicked = false;
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!clicked) return;

            const rect = canvas.getBoundingClientRect();
            const width = e.clientX - rect.left - startX;
            const height = e.clientY - rect.top - startY;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeRect(startX, startY, width, height);
        };

        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mousemove", handleMouseMove);

        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("mousemove", handleMouseMove);
        };
    }, [dimensions]);

    return(
        <canvas ref={canvasRef}  width={dimensions.width} height={dimensions.height} />
    );
}