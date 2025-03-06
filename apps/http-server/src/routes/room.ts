import { Router, Request, Response} from "express";
import { AuthenticatedRequest, auth } from "../middleware/auth";
import {CreateRoomZodSchema} from "@repo/common/zodtypes";
import {prismaClient} from "@repo/db/prismaDb"
const RoomRouter : Router = Router();

RoomRouter.post('/', auth, async(req : AuthenticatedRequest, res : Response) => {        // creating a room
    const incomingData = CreateRoomZodSchema.safeParse(req.body);
    
    if(!incomingData.success || !req.username) {
        res.status(403).json({
            message : "Invalid input for room name"
        })
        return;
    }

    const username = req.username;

    try {
            await prismaClient.room.create({
            data : {
                slug : incomingData.data.roomName,
                adminId : username,              
            }
        })

        res.status(200).json({
            message : "Room created.",
            roomname : incomingData.data.roomName
        })
        return;
    } catch (error) {
        res.status(500).json({
            message : "Internal server error while creating room."
        })
        return;
    }
})



RoomRouter.get('/:slug', auth , async(req : AuthenticatedRequest, res: Response) => {      // finding the room details

        const slug = req.params.slug;
        const username = req.username;
        if(!slug || !username) {
            res.status(403).json({
                message : "Invalid room"
            })
            return;
        }
        try {
            const room = await prismaClient.room.findFirst({
                where : {
                    slug
                }
            })
            if(!room) {
                res.status(403).json({
                    message : "Invalid room."
                })
                return;
            }
            res.status(200).json({
                room
            })
            return;
        } catch (error) {
            res.status(501).json({
                message : "Internal server error while fetching the room"
            })
        }

})

RoomRouter.get('/canvas/:roomName', auth , async(req : AuthenticatedRequest, res: Response) => { // finding all the chats or messages inside the room

    const roomName = req.params.roomName;
    const username = req.username;
    if(!roomName || !username) {
        res.status(403).json({
            message : "Invalid room"
        })
        return;
    }
    try {
        const chats = await prismaClient.canvasDrawing.findMany({
            where : {
                roomName
            }
        })
        res.status(200).json({
            chats
        })
        return;
    } catch (error) {
        res.status(501).json({
            message : "Internal server error while fetching the chats"
        })
    }

})


export default RoomRouter;