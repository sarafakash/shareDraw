import { RoomCanvas } from "@/components/RoomCanvas";

export default async function CanvasPage ({params} : {
    params : {
        roomName : string 
    }
}) {
    const roomName = (await params).roomName;
    return <RoomCanvas roomName={roomName}/>
 
}