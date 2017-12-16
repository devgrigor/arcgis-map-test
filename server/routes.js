/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';

const proxy = require('express-http-proxy');

export default function (app) {
    // Insert routes below
    app.use('/api/enums', require('./api/enum'));
    app.use('/api/donations', require('./api/donation'));
    app.use('/getApp', (req, res) => {
        res.writeHead(302, {
            'Location': '/download'
        });
        res.end();
    });

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|components|app)/*')
        .get(errors[404]);

    if (env === 'development') {
        // All other routes should redirect to the index.html
        app.use('/*', proxy('http://localhost:4200', {
            proxyReqPathResolver: function (req) {
                return req.originalUrl;
            }
        }));
    }
}
