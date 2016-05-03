/// <reference path='../../typings/main.d.ts' />

import * as async from 'async';
import * as request from 'supertest';
// import * as uri from 'urijs';

/* tslint:disable:no-var-requires */ const conf = require('../../conf/conf.js');
const url = conf['test-server'];

describe('Ram Sample Test', () => {
    it('should respond to only certain methods', (done) => {
        fail();
        async.series([
            (cb) => { request(url).post('/').send({ prop1: 'new' }).expect(405, cb); }
        ], done);
    });
});