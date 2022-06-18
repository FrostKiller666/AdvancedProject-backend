import {Router} from "express";
import {UserRecord} from "../records/user.record";

export const userRouter = Router()

    .get('/', async (req, res) => {

    })
    .post('/register', async (req, res) => {
        const user = new UserRecord(req.body);
        console.log(user)
        await user.insert();

        res.json(user);
    });
