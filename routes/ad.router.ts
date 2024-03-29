import {Router} from "express";
import {AdRecord} from "../records/ad.record";
import {UserRecord} from "../records/user.record";

export const adRouter = Router()

    .get('/search/:name?', async (req, res) => {

        const ads = await AdRecord.getAll(req.params.name ?? '');

        // // @ts-ignore
        // req.session.name = 'sadasda';
        //// @ts-ignore
        //req.session.token = 123123123;
        //
        // const data = req.session;
        // console.log(data);
        res.json(ads);
    })
    .get('/:id', async (req, res) => {
        const ad = await AdRecord.getOne(req.params.id);

        res.json(ad);
    })
    .post('/', async (req, res) => {
        const registerDataReq = req.body;
        const userData = await UserRecord.getOneUser(registerDataReq.username);

        const ad = new AdRecord({
            ...registerDataReq,
            userId: userData.id,
        });
        await ad.insert();

        res.json(ad);
    });

