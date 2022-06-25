import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import {ValidationError} from "./errrors";

interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) throw new ValidationError('Nie masz dostępu do danego zasobu spróbuj jeszcze raz.');

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        (req as CustomRequest).token = decoded;

        next();

    } catch (err) {
        res.status(403).send('You need to authenticate');
    }

}
