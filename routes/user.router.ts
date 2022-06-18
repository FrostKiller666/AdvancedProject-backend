import {Router} from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import {ValidationError} from "../utils/errrors";
import {UserRecord} from "../records/user.record";

export const userRouter = Router()

    .get('/users', async (req, res) => {
        const userList = await UserRecord.getAll();
    })
    .post('/register', async (req, res) => {
        const user = new UserRecord(req.body);
        /* hash(user.password, 10, async (err, hash) => {
             if (err) {
                 throw new ValidationError(`${err}`);
             } else {
                 user.password = hash;
                 await user.insert();

                 res.json(user);
             }
         });*/
        user.password = await bcrypt.hash(user.password, 12);
        await user.insert();

    })
    .post('/login', async (req, res) => {
        const user = req.body;
        const {email, password} = user.data;

        if ((email || password) === undefined) {
            throw new ValidationError('Coś poszło nie task, spróbuj potem. ');
        }

        const userData = await UserRecord.getOne(email);

        if (userData === null) {
            throw new ValidationError('Taki adres mailowy nie istnieje.');
        }

        // compare(password, userData.password, function(err, result) {
        //     console.log(result, password, userData.password)
        // });
        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        console.log(isPasswordCorrect);
        const accessToken = jwt.sign({id: userData.username}, process.env.TOKEN_SECRET, {expiresIn: 90000});
        const refreshToken = jwt.sign({id: userData.username}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: 180000});

        res.send({accessToken, refreshToken});
    });
