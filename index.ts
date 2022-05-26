import express, {Router} from "express";
import cors from "cors";
import rateLimit from 'express-rate-limit'
import 'express-async-errors';

import './utils/db';
import {handleError} from "./utils/errrors";
import {adRouter} from "./routes/ad.router";

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 1115 minutes)
}));
// Routes
const router = Router();

router.use('/ad', adRouter);
app.use('/api', router);

// app.get('/', async (req, res) => {
//     throw new ValidationError('fck!');
//
// });

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});
