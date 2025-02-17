'Use strict';

import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import authRoutes from '../src/auth/auth.routes.js';
import adminRoutes from '../src/admin/routes/admin.routes.js';

const configs = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(helmet());
    //app.use(limiter);
    app.use(morgan('dev'));
}

const routes = (app) => {
    app.use(authRoutes);
    app.use('/v1/admin', adminRoutes);
}

export const initServer = async () => {
    const app = express();
    try {
        configs(app);
        routes(app);
        app.listen(process.env.PORT);
        console.log(`Server running in port ${process.env.PORT}`);
    } catch (e) {
        console.error('Server init failed', e);
    }
}