import express from "express";
import UserRouter from "./routes/user";
import RoomRouter from "./routes/room";

const app = express();
app.use(express.json());

app.use('/user', UserRouter)
app.use('/room', RoomRouter)

app.listen(3003);