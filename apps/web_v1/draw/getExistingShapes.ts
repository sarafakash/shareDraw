import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function getExistingShapes(roomName : string) {
    const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const res = await axios.get(`${URL}/room/canvas/${roomName}`)
    const shapes = res.data.shapes;
    const exisitngshapesData = shapes.map((x : {message : string}) => {
        const extractedShapeData = JSON.parse(x.message);
        return extractedShapeData.shape;
    });
    return exisitngshapesData;
 
}

