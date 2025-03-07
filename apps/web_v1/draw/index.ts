export function initDraw(canvas : HTMLCanvasElement, ctx : CanvasRenderingContext2D , dimensions : { width: number; height: number}) {

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

    const handleMouseUp = () => {
        clicked = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!clicked) return;

        const rect = canvas.getBoundingClientRect();
        const width = e.clientX - rect.left - startX;
        const height = e.clientY - rect.top - startY;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(16,24,40,255)";
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
    
}