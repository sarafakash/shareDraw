
import { getExistingShapes } from "./getExistingShapes";

type Tool = "circle" | "rect" | "pencil";

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

export class Draw {

    private canvas : HTMLCanvasElement;
    private roomName : string;
    private socket : WebSocket;
    private ctx : CanvasRenderingContext2D;
    private existingShape : Shape[];
    private clicked = false;
    private startX = 0;
    private startY = 0;
    private selectedTool : Tool = "circle";
    
    constructor(canvas : HTMLCanvasElement , roomName : string, socket : WebSocket , ctx : CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.existingShape = [];
        this.roomName = roomName;
        this.socket = socket;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }

    async init() {
        this.existingShape = await getExistingShapes(this.roomName);
        console.log(this.existingShape);
        this.clearCanvas();
    }


    setTool(tool : Tool) {
        this.selectedTool = tool;
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data)
            if(message.type === "draw") {
                console.log("debug1")
                console.log(message)
                const parsedShape = JSON.parse(message.message);
                console.log(parsedShape)
                this.existingShape.push(parsedShape.shape);
                this.clearCanvas();
            }
        }
    }

    handleMouseDown = (e: MouseEvent) => {
        const rect = this.canvas.getBoundingClientRect();
        this.clicked = true;
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;
    };

    handleMouseUp = (e : MouseEvent) => {
        this.clicked = false;
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
        const shape : Shape = {
            type : "rect",
            x : this.startX,
            y : this.startY,
            height,
            width
        }
        this.existingShape.push(shape)
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type: "draw", message: JSON.stringify({ shape }), roomName : this.roomName }));
        }else{
            console.log("erorr in ws")
        }
        
    };

    handleMouseMove = (e: MouseEvent) => {
        if (!this.clicked) return;

        const rect = this.canvas.getBoundingClientRect();
        const width = e.clientX - rect.left - this.startX;
        const height = e.clientY - rect.top - this.startY;
        this.clearCanvas();
        this.ctx.strokeRect(this.startX, this.startY, width, height);
    };


    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.handleMouseDown);
        this.canvas.addEventListener("mouseup", this.handleMouseUp);
        this.canvas.addEventListener("mousemove", this.handleMouseMove);

    }

    clearCanvas () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = "white";
        this.ctx.fillStyle = "rgba(16,24,40,255)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.existingShape.map((shape) => {
            if(shape.type === "rect") {
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            }
        })
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.handleMouseDown);
        this.canvas.removeEventListener("mouseup", this.handleMouseUp);
        this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    }
    

}