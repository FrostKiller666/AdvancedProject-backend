import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import rateLimit from 'express-rate-limit'
import cookiesMiddleware from "universal-cookie-express"
import 'express-async-errors';

import './utils/db';
import {handleError} from "./utils/errrors";
import {adRouter} from "./routes/ad.router";
import {config} from "./config/config";
import {userRouter} from "./routes/user.router";

dotenv.config();
const app = express();

app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
}));
app.use(cookiesMiddleware());
// app.set("trust proxy", 1);
// app.use(
//     session({
//         resave: false,
//         saveUninitialized: false,
//         secret: "sessionss",
//         cookie: {
//             maxAge: 1000 * 60 * 60,
//             sameSite: "lax",
//             // httpOnly: false,
//             secure: false,
//         },
//     })
// );
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 1115 minutes)
}));
// Routes
/**
 Server router fix
 const router = Router();

 router.use('/ad', adRouter);
 app.use('/api', router);
 */
app.use('/ad', adRouter);
app.use('/user', userRouter);

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});
