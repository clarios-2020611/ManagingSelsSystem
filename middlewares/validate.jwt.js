import jwt from 'jsonwebtoken';
import { findUser } from '../helpers/db.validator.js';

export const validateJwt = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token)
        return res.status(401).send({ success: false, message: 'Unauthorized' });

    try {
        const jwtToken = token.startsWith('Bearer ') ? token.slice(7) : token;

        const payload = jwt.verify(jwtToken, process.env.SECRET_KEY);

        req.user = payload;

    } catch (e) {
        return res.status(401).send({ success: false, message: 'Token not valid', error: e.message });
    }

    next();
};