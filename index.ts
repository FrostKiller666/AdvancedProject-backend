import express from "express";
import cors from "cors";
import rateLimit from 'express-rate-limit'
import 'express-async-errors';

import './utils/db';
import {handleError} from "./utils/errrors";

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 5 minutes)
}));
// Routes

// app.get('/', async (req, res) => {
//     throw new ValidationError('fck!');
//
// });

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});
