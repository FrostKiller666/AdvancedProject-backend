import express from "express";
import cors from "cors";
import 'express-async-errors';

import './utils/db';
import {handleError} from "./utils/errrors";

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());

// Routes

app.get('/', async (req, res) => {
    //throw new ValidationError('fck!');

});

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});
