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
    console.log(incomingData.data.roomName)

    try {
            const resp = await prismaClient.room.create({
            data : {
                slug : incomingData.data.roomName,
                adminId : username,              
            }
        })

        console.log(resp)

        res.status(200).json({
            message : "Room created.",
            roomname : incomingData.data.roomName
        })
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message : "Internal server error while creating room."
        })
        return;
    }
})



RoomRouter.get('/:slug', async(req : Request, res: Response) => {      // finding the room details

        const slug = req.params.slug;
        console.log(slug)
        if(!slug ) {
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

RoomRouter.get('/canvas/:roomName', async(req : Request, res: Response) => { // finding all the chats or messages inside the room

    const roomName = req.params.roomName;
    if(!roomName) {
        res.status(403).json({
            message : "Invalid room"
        })
        return;
    }
    try {
        const shapes = await prismaClient.canvasDrawing.findMany({
            where : {
                roomName
            }
        })
        res.status(200).json({
            shapes
        })
        return;
    } catch (error) {
        res.status(501).json({
            message : "Internal server error while fetching the chats"
        })
    }

})


export default RoomRouter;