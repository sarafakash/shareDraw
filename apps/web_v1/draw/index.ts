import axios from "axios";
import { Draw } from "./draw";
import dotenv from "dotenv";
dotenv.config();

type Shape = {
    type : "rect";
    x : number;
    y : number;
    width : number;
    height : number;
} | {
    type : "circle";
    centreX : number;
    centreY : number;
    radius : number;
}

export async function initDraw(canvas : HTMLCanvasElement, ctx : CanvasRenderingContext2D , dimensions : { width: number; height: number}, roomName : string ,socket : WebSocket) {

    let existingShape : Shape[] = await getExistingShapes(roomName);
    console.log(existingShape)
    // ctx.fillStyle = "rgba(16,24,40,255)";
    // ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    // ctx.strokeStyle = "white";

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        if(message.type === "draw") {
            console.log("debug1")
            console.log(message)
            const parsedShape = JSON.parse(message.message);
            console.log(parsedShape)
            existingShape.push(parsedShape.shape);
            clearCanvas(canvas, ctx, existingShape);
        }
    }

    clearCanvas(canvas, ctx, existingShape);

    let clicked = false;
    let startX = 0;
    let startY = 0;

    const handleMouseDown = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        clicked = true;
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
    };

    const handleMouseUp = (e : MouseEvent) => {
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        const shape : Shape = {
            type : "rect",
            x : startX,
            y : startY,
            height,
            width
        }
        existingShape.push(shape)
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "draw", message: JSON.stringify({ shape }), roomName }));
        }else{
            console.log("erorr in ws")
        }
        
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!clicked) return;

        const rect = canvas.getBoundingClientRect();
        const width = e.clientX - rect.left - startX;
        const height = e.clientY - rect.top - startY;
        clearCanvas(canvas, ctx, existingShape);
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
    
}

function clearCanvas (canvas : HTMLCanvasElement, ctx : CanvasRenderingContext2D, existingShape : Shape[]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    ctx.fillStyle = "rgba(16,24,40,255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    existingShape.map((shape) => {
        if(shape.type === "rect") {
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    })
}

async function getExistingShapes(roomName : string) {
    const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const res = await axios.get(`${URL}/room/canvas/${roomName}`)
    const shapes = res.data.shapes;
    const exisitngshapesData = shapes.map((x : {message : string}) => {
        const extractedShapeData = JSON.parse(x.message);
        return extractedShapeData.shape;
    });
    return exisitngshapesData;
 
}


