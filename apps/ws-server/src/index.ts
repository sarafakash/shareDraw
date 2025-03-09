import { WebSocket, WebSocketServer } from "ws";
import { JWT } from "@repo/common/jwtSecurity";
import { prismaClient } from "@repo/db/prismaDb";
import dotenv from "dotenv";
dotenv.config();

interface User {
    username: string,
    ws: WebSocket,
    rooms: string[]
}

const users: User[] = [];

function checkValidUser(receivedToken: string) {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        console.error("JWT_SECRET is not defined.");
        return null;
    }

    try {
        const decoded = JWT.verify(receivedToken, JWT_SECRET) as string;
        if (!decoded) {
            console.error("Failed to decode the JWT token.");
            return null;
        }
        return decoded;
    } catch (error) {
        console.error("Error verifying JWT token:", error);
        return null;
    }
}

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', function connection(ws, req) {
    const url = req.url;
    if(!url)
        return;

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const receivedToken = queryParams.get('token') || "";

    if (!receivedToken || !receivedToken.includes('Bearer')) {
        console.error("Authorization header missing or invalid.");
        ws.close();
        return;
    }

    const refinedToken = receivedToken.split(" ")[1] as string;
    const username = checkValidUser(refinedToken);

    if (!username) {
        console.error("Invalid user, closing connection.");
        ws.close();
        return;
    }

    console.log(`User ${username} connected`);

    // user is valid after this and the socket is initialized for him
    users.push({ username, ws, rooms: [] });

    ws.on('message', async function message(data) {
        try {
            let parsedData;     // {type : "" , roomName : ""}

            if (typeof data !== "string") {
                parsedData = JSON.parse(data.toString());
            } else {
                parsedData = JSON.parse(data);
            }

            if (parsedData.type === "subscribe") {
                const user = users.find(x => x.ws === ws);
                if (user) {
                    user.rooms.push(parsedData.roomName);
                    console.log(`${username} subscribed to room: ${parsedData.roomName}`);
                }
            }

            if (parsedData.type === "unsubscribe") {
                const user = users.find(x => x.ws === ws);
                if (!user) return;
                user.rooms = user.rooms.filter(x => x !== parsedData.roomName);
                console.log(`${username} unsubscribed from room: ${parsedData.roomName}`);
            }

            if (parsedData.type === "draw") {
                const roomName = parsedData.roomName;
                const message = parsedData.message;

                // Save drawing to DB
                await prismaClient.canvasDrawing.create({
                    data: {
                        roomName,
                        message,
                        username
                    }
                });

                // Broadcast drawing to all users in the room
                users.forEach(user => {
                    if (user.rooms.includes(roomName)) {
                        user.ws.send(JSON.stringify({
                            type: parsedData.type,
                            message: parsedData.message,
                            roomName: parsedData.roomName,
                            sentBy: username
                        }));
                    }
                });
            }
        } catch (error) {
            console.error("Error processing message:", error);
            ws.send("Internal server error.");
        }
    });

    ws.on('close', () => {
        console.log(`${username} disconnected`);
        // Remove user from the list on disconnect
        const index = users.findIndex(x => x.ws === ws);
        if (index !== -1) users.splice(index, 1);
    });
});
