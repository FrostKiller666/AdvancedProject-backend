import {Router} from "express";
import {UserRecord} from "../records/user.record";
import {hash} from 'bcrypt'
import {ValidationError} from "../utils/errrors";

export const userRouter = Router()

    .get('/', async (req, res) => {

    })
    .post('/register', async (req, res) => {
        const user = new UserRecord(req.body);
        hash(user.password, 10, async (err, hash) => {
            if (err) {
                throw new ValidationError(`${err}`);
            } else {
                user.password = hash;
                await user.insert();

                res.json(user);
            }
        });
    });
