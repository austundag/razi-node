'use strict';

/* eslint no-param-reassign: 0, max-len: 0 */

const _ = require('lodash');

const models = require('../../../models');

const testJsutil = require('../test-jsutil');

class Generator {
    constructor(generators = {}) {
        this.userIndex = -1;
        this.consentTypeIndex = -1;
        this.consentDocumentIndex = -1;
        this.consentTypeAdded = {};
        this.consentIndex = -1;
        this.languageIndex = -1;
        this.stateIndex = 0;
    }

    newUser(override) {
        this.userIndex += 1;
        const userIndex = this.userIndex;
        let username = 'uSeRnAmE';
        let email = 'eMaIl';
        if ((userIndex + 1) % 3 === 0) {
            username = testJsutil.oppositeCase(username);
            email = testJsutil.oppositeCase(email);
        }
        let user = {
            username: `${username}_${userIndex}`,
            password: `password_${userIndex}`,
            email: `${email}_${userIndex}@example.com`,
        };
        if ((userIndex + 1) % 2 === 0) {
            delete user.username;
        }
        if (override) {
            user = _.assign(user, override);
        }
        if (!user.role) {
            user.role = 'participant';
        }
        if (userIndex % 2 === 1) {
            user.firstname = `firstname_${userIndex}`;
            user.lastname = `lastname_${userIndex}`;
            user.institution = `institution_${userIndex}`;
        }
        return user;
    }

    newConsentType() {
        this.consentTypeIndex += 1;
        const index = this.consentTypeIndex;
        return {
            name: `name_${index}`,
            title: `title_${index}`,
            type: `type_${index}`,
        };
    }

    newConsentDocument(override) {
        if (!override.typeId) {
            throw new Error('typeId is required');
        }
        this.consentDocumentIndex += 1;
        const index = this.consentDocumentIndex;
        const result = {
            content: `Sample consent section content ${index}`,
        };
        const count = this.consentTypeAdded[override.typeId] || 0;
        if (count) {
            result.updateComment = `Update comment ${count}`;
        }
        this.consentTypeAdded[override.typeId] = count + 1;
        Object.assign(result, override);
        return result;
    }

    newConsent(override) {
        if (!override.sections) {
            throw new Error('sections is required.');
        }
        this.consentIndex += 1;
        const index = this.consentIndex;
        const result = {
            name: `name_${index}`,
        };
        Object.assign(result, override);
        return result;
    }

    nextLanguage() {
        this.languageIndex += 1;
        const index = this.languageIndex;
        const i4 = index % 4;
        switch (i4) {
        case 2:
            return 'es';
        case 3:
            return 'en';
        default:
            return null;
        }
    }

    newState(index) {
        let stateIndex = index;
        if (stateIndex === undefined) {
            this.stateIndex += 1;
            stateIndex = this.stateIndex;
        }
        return ['MA', 'MD', 'ID', 'VA', 'GA'][stateIndex % 5];
    }
}

module.exports = Generator;
