import { Router , Request, Response} from "express";
import {SignupUserZodSchema, SigninUserZodSchema} from "@repo/common/zodtypes";
import {bcryptHash} from "@repo/common/bcryptHash";
import {prismaClient} from "@repo/db/prismaDb";
import {JWT} from "@repo/common/jwtSecurity";
import dotenv from "dotenv";

dotenv.config();

const UserRouter : Router = Router();


UserRouter.post('/signup', async (req : Request , res : Response ) => {
    const incomingData = SignupUserZodSchema.safeParse(req.body);

    
    if(!(incomingData.success)) {
        res.status(403).json({
            message : "Invalid inputs",
            Error : incomingData.error
        })
        return;
    }
    const {username, firstName, lastName, password} = incomingData.data;

    try {

        const checkDuplicateUsername = await prismaClient.user.findFirst({
            where : {
                username : username
            }
        })
        if(checkDuplicateUsername) {
            res.status(403).json({
                message : "Username already exists."
            })
            return;
        }

        const hashedPassword = await bcryptHash.hash(password,5);

        await prismaClient.user.create({
            data : {
                username, firstName, lastName, password : hashedPassword
            }
        })
        res.status(200).json({
            message : "Signup OK"
        })
        return;
    } catch (error) {
        res.status(403).json({
            message : "Internal server error in the signup route."
        })
        return;
    }

})

UserRouter.post('/login', async (req : Request, res : Response)=> {
    const incomingData = SigninUserZodSchema.safeParse(req.body);
    if(!(incomingData.success)) {
        res.status(403).json({
            message : "Invalid inputs for username or password."
        })
        return;
    }
    const {username, password} = incomingData.data;

    try {
        const checkForUsername = await prismaClient.user.findFirst({
            where : {
                username : username
            }
        })

        if(!checkForUsername) {
            res.status(403).json({
                message : "Invalid Username."
            })
            return;
        }

        const unhashPassword = await bcryptHash.compare(password, checkForUsername.password);
        if(!unhashPassword) {
            res.status(403).json({
                message : "Invalid password."
            })
            return;
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined.");
            res.status(500).json({ message: "Internal server error." });
            return;
        }
        const token ="Bearer "+JWT.sign(username, process.env.JWT_SECRET);
        res.status(200).json({
            token
        })
        return;
    } catch (error) {
        res.status(501).json({
            message : "Internal server failure at signin."
        })
    }
    
})



export default UserRouter;