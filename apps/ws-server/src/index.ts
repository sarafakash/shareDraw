import { WebSocket, WebSocketServer } from "ws";
import {JWT} from "@repo/common/jwtSecurity";
import {prismaClient} from "@repo/db/prismaDb";
import dotenv from "dotenv";
dotenv.config();

interface User {
    username : string,
    ws : WebSocket,
    rooms : string[]
}


const users : User[] = []



function checkValidUser(recievedToken : string) {
    const JWT_SECRET = process.env.JWT_SECRET;
    if(!JWT_SECRET)
        return null;
    try {
        const decoded = JWT.verify(recievedToken,JWT_SECRET) as string;
        if(!decoded)
            return null;
        return decoded;
    } catch (error) {
        return null;
    }
}



const wss = new WebSocketServer({port : 3001});

wss.on('connection', function connection(ws, req) {

    const recievedToken = req.headers.authorization;

    if(!recievedToken || !recievedToken.includes('Bearer')){
        ws.close();
        return null;
    }

    const refinedToken = recievedToken.split(" ")[1] as string;
    const username = checkValidUser(refinedToken);

    if(!username || username == null) {
        ws.close();
        return;
    }

    // user is valid after this and the socket is initialized for him 

    users.push({ username, ws, rooms : [] })



    ws.on('message', async function message(data){
        let parsedData;     // {type : "" , roomName : ""}
        if(typeof data !== "string"){
            parsedData = JSON.parse(data.toString());
        }else{
            parsedData = JSON.parse(data);
        }

        console.log(parsedData);
        
        if(parsedData.type === "subscribe") {
            const user = users.find(x => x.ws === ws)
            user?.rooms.push(parsedData.roomName);
            console.log(users)
        }

        if(parsedData.type === "unsubscribe") {
            const user = users.find(x => x.ws === ws)
            if(!user)
                return;
            user.rooms= user?.rooms.filter(x => x === parsedData.roomName);    // {type : "" , roomName : ""}
            console.log(users)
        }

        console.log("message recieved.");
        console.log(parsedData);


        if(parsedData.type === "draw") {    // {type : " ", roomName : " ", message : " "}
            const roomName = parsedData.roomName;
            const message =  parsedData.message;
            
            await prismaClient.canvasDrawing.create({
                data: {
                    roomName,
                    message,
                    username
                }
            })

            users.forEach(user => {
                if(user.rooms.includes(roomName)) {
                    user.ws.send(JSON.stringify({
                        type : parsedData.type,
                        message : parsedData.message,
                        roomName : parsedData.roomName,
                        sentBy : username
                    }))
                }
            })
        }

    })

})

