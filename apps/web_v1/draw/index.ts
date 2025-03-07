import { clear } from "console";

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

export function initDraw(canvas : HTMLCanvasElement, ctx : CanvasRenderingContext2D , dimensions : { width: number; height: number}) {

    let existingShape : Shape[] = []
    ctx.fillStyle = "rgba(16,24,40,255)";
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

    const handleMouseUp = (e : MouseEvent) => {
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        existingShape.push({
            type : "rect",
            x : startX,
            y : startY,
            height,
            width
        })
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
    ctx.fillStyle = "rgba(16,24,40,255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    existingShape.map((shape) => {
        if(shape.type === "rect") {
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    })
}