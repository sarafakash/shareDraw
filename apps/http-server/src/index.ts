import express from "express";
import UserRouter from "./routes/user";
import RoomRouter from "./routes/room";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.use('/user', UserRouter)
app.use('/room', RoomRouter)

app.listen(3003);