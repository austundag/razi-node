'use strict';

/* eslint no-param-reassign: 0, max-len: 0 */

const chai = require('chai');
const _ = require('lodash');
const moment = require('moment');

const expect = chai.expect;

const comparator = {
    createdAt(server) {
        const compareDateTime = moment().subtract(2, 'second');
        const createdDateTime = moment(server.createdAt);
        expect(createdDateTime.isAfter(compareDateTime)).to.equal(true);
    },
    user(client, server) {
        const expected = _.cloneDeep(client);
        expected.id = server.id;
        delete expected.password;
        if (!Object.prototype.hasOwnProperty.call(expected, 'role')) {
            expected.role = 'participant';
        }
        if (!expected.username) {
            expected.username = expected.email.toLowerCase();
        }
        this.createdAt(server);
        expected.createdAt = server.createdAt;
        expect(server).to.deep.equal(expected);
    },
    consentDocument(client, server) {
        const expected = _.cloneDeep(client);
        const createdAt = server.createdAt;
        expect(!!createdAt).to.equal(true);
        comparator.createdAt(createdAt);
        expected.createdAt = createdAt;
        expect(server).to.deep.equal(expected);
        return expected;
    },
    consentDocuments(client, server) {
        let expected = _.cloneDeep(client);
        expect(client.length).to.equal(server.length);
        if (client.length) {
            expected = client.map((r, index) => this.consentDocument(r, server[index]));
            expect(server).to.deep.equal(expected);
        } else {
            expect(client.length).to.equal(0);
        }
        expect(server).to.deep.equal(expected);
        return expected;
    },
    consent(client, server) {
        const expected = _.cloneDeep(client);
        expected.sections = this.consentDocuments(expected.sections, server.sections);
        expect(server).to.deep.equal(expected);
    },
};

module.exports = comparator;
