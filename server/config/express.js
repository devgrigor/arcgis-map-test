/**
 * Express configuration
 */

'use strict';

import express from 'express';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import path from 'path';
import config from './environment';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';

const MongoStore = connectMongo(session);

export default function (app) {
    const env = app.get('env');

    if (env === 'development' || env === 'test') {
        app.use(express.static(path.join(config.root, '.tmp')));
    }

    if (env === 'production') {
        app.use(favicon(path.join(config.root, 'client/dist', 'favicon.ico')));
    }
    app.set('appPath', path.join(config.root, 'client/dist'));
    app.use(express.static(app.get('appPath')));
    app.use(morgan('dev'));

    app.set('views', config.root + '/server/views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(compression());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());

    // Persist sessions with MongoStore / sequelizeStore
    // oauth 1.0 strategy, and Lusca depends on sessions
    app.use(session({
        secret: config.secrets.session,
        saveUninitialized: true,
        resave: false,
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            db: 'blood'
        })
    }));


    // Accept CORS in development evirement
    if (env === 'development') {
        app.use(function(req, res, next) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-XSRF-TOKEN");
          next();

        });
    }

    if ('development' === env || 'test' === env) {
        app.use(errorHandler()); // Error handler - has to be last
    }
}
