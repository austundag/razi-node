/* global module */

'use strict';

/* eslint-disable no-console */

const swaggerTools = require('swagger-tools');
const swaggerObject = require('../swagger.json');

const spec = swaggerTools.specs.v2;
spec.validate(swaggerObject, (err, result) => {
    if (err) {
        console.log(err);
        return;
    }
    if (typeof result !== 'undefined') {
        if (result.errors.length > 0) {
            console.log('The Swagger document is invalid...');
            console.log('');
            console.log('Errors');
            console.log('------');
            result.errors.forEach((err2) => {
                console.log(`#/${err2.path.join('/')}: ${err2.message}`);
            });
            console.log('');
        }
        if (result.warnings.length > 0) {
            console.log('Warnings');
            console.log('--------');
            result.warnings.forEach((warn) => {
                console.log(`#/${warn.path.join('/')}: ${warn.message}`);
            });
        }
        if (result.errors.length > 0) {
            console.log('Swagger document is invalid');
            return;
        }
    }
    console.log('Swagger document is valid');
});
