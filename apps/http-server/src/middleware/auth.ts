import { Request, Response, NextFunction} from "express";
import {JWT} from "@repo/common/jwtSecurity";
import dotenv from "dotenv";
dotenv.config();

export interface AuthenticatedRequest extends Request {
    username ? : string;
}

export function auth (req :  AuthenticatedRequest, res : Response, next : NextFunction) {
    const recievedToken = req.headers.authorization;
    if(!recievedToken || !recievedToken.startsWith("Bearer")){
        res.status(403).json({
            message : "FORBIDDEN 403. "
        })
        return;
    }
    if(!process.env.JWT_SECRET){
        res.status(501).json({
            message : "Internal server failure due to missing jwt key"
        })
        return;
    }
    if(!recievedToken.includes(' ')) {
        res.status(500).json({
            message : "Internal server error!!"
        })       
        return;
    }
    const tokenExtracted = recievedToken.split(' ')[1];
    if(tokenExtracted === undefined) {
        res.status(403).json({
            message : "FORBIDDEN 403.."
        })   
        return;
    }
    try {
        const decodedTokenUsername = JWT.verify(tokenExtracted, process.env.JWT_SECRET) as string;
        req.username = decodedTokenUsername;
        next();
    } catch (error) {
        res.status(403).json({
            message : "Forbidden 403 :"
        })
    }
}