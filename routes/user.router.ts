import {Router} from "express";
import jwt from 'jsonwebtoken';
import {compare, hash} from 'bcrypt';

import {ValidationError} from "../utils/errrors";
import {UserRecord} from "../records/user.record";
import {authenticate} from "../utils/authenticate";
import {AdRecord} from "../records/ad.record";

export const userRouter = Router()

    .post('/register', async (req, res) => {
        const user = new UserRecord(req.body);
        // @TODO after all maybe better use try-catch block
        hash(user.password, 10, async (err, hash) => {
            if (err) {
                throw new ValidationError('Coś poszło nie tak, spróbuj jeszcze raz.');
            } else {
                if (user.password.length > 36 || user.password.length < 8) {
                    throw new ValidationError('Hasło musi być w przedziale od 8 do 36');
                }
                user.password = hash;
                await user.insert();
                res.json(user);
            }
        });
    })
    .post('/auth/login', async (req, res) => {
        const user = req.body;
        const {email, password} = user.data;

        if ((email || password) === undefined) {
            throw new ValidationError('Coś poszło nie tak, spróbuj potem. ');
        }

        const userData = await UserRecord.getOne(email);
        if (!userData) {
            throw new ValidationError('Taki adres mailowy nie istnieje.');
        }


        if (await compare(password, userData.password)) {
            const accessToken = jwt.sign({id: userData.username}, process.env.TOKEN_SECRET, {expiresIn: '7 days'});
            // @TODO REFRESH TOKEN IS FOR FUTURE, NOW IT ISN'T WORK
            const refreshToken = jwt.sign({id: userData.username}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: 0});
            // @TODO CSRF for more safety option.
            res.json({
                logged: true,
                userId: userData.id,
                accessToken,
            });
        } else {
            throw new ValidationError('Hasła są nieprawidłowe, spróbuj jeszcze raz');
        }

    })
    .patch('/YourAccount', async (req, res) => {
        const user = req.body;
        const username = user.resAuthData.data.id;

        if ((username || user.password || user.oldPassword) === undefined) {
            throw new ValidationError('Coś poszło nie tak, spróbuj potem. ');
        }

        const userData = await UserRecord.getOneUser(username);
        if (!userData) {
            throw new ValidationError('Coś poszło nie tak, spróbuj za kilka chwil.');
        }

        if (await compare(user.oldPassword, userData.password)) {
            hash(user.password, 10, async (err, hash) => {
                if (err) {
                    throw new ValidationError('Coś poszło nie tak, spróbuj jeszcze raz.');
                } else {
                    if (user.password.length > 36 || user.password.length < 8) {
                        throw new ValidationError('Hasło musi być w przedziale od 8 do 36');
                    }
                    await UserRecord.patchPassword(hash, username);

                    res.json(true);
                }
            });
        } else {
            throw new ValidationError('Hasła są nieprawidłowe, spróbuj jeszcze raz');
        }


    })
    .post('/announcement', async (req, res) => {
        const user = req.body;
        const userData = await UserRecord.getOneUser(user.username);
        const listAnnouncementUser = await AdRecord.getAllAnnouncementOfUser(userData.id);

        res.json(listAnnouncementUser);
    })
    .get('/authenticate', authenticate, async (req, res) => {
        res.end();
    });

