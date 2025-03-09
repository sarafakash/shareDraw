import express from "express";
import UserRouter from "./routes/user";
import RoomRouter from "./routes/room";
import cors from "cors";

const app = express();
app.use((req, res, next) => {
    if (req.method !== "GET") {
        express.json()(req, res, next);
    } else {
        next();
    }
});
app.use(cors());

app.use('/user', UserRouter)
app.use('/room', RoomRouter)

app.listen(3003);