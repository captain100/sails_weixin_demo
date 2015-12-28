var express = require('express');
var bodyParser = require('body-parser');
module.exports.express = {

    bodyParser: function (options) {

        // Get default body parser from Express
        var defaultBodyParser = bodyParser(options);

        // Get function for consumung raw body, yum.
        var getBody = require('raw-body');

        return function (req, res, next) {

            // If there's no content type, or it's text/plain, parse text
            if (!req.headers['content-type'] ||
                req.headers['content-type'].match('text/plain')) {

                // flag as parsed
                req._body = true;

                // parse
                getBody(req, {
                    limit: 100000, // something reasonable here
                    expected: req.headers['content-length']
                }, function (err, buf) {
                    if (err) return next(err);

                    // Make string from buffer
                    buf = buf.toString('utf8').trim();

                    // Set body
                    req.body = buf.length ? { content: buf } : {}

                    // Continue
                    next();
                });
            }

            // Otherwise try the default parsers
            else return defaultBodyParser(req, res, next);
        };


    }
};