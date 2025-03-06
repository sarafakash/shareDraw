
import { z } from 'zod';

 export const SignupUserZodSchema = z.object({
    username : z.string().min(3).max(20),
    firstName : z.string().min(3).max(15),
    lastName : z.string().min(3).max(15),
    password : z.string().min(3).max(15)
 })

 export const SigninUserZodSchema = z.object({
    username : z.string().min(3).max(20),
    password : z.string().min(3).max(15)
 })

 export const CreateRoomZodSchema = z.object({
   roomName : z.string().min(3).max(20),
})