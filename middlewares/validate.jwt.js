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

export const isAdmin = async (req, res, next) => {
    try {
        const { user } = req
        if (!user || user.role !== 'ADMIN') return res.status(403).send(
            {
                success: false,
                message: `You dont have access | username ${user.username}`
            }
        )
        next()
    } catch (err) {
        console.error(err)
        return res.status(403).send(
            {
                success: false,
                message: 'Unauthorized role'
            }
        )
    }
}