'use strict';

const UserDAO = require('./user.dao');
const AuthDAO = require('./auth.dao');
const ConsentTypeDAO = require('./consent-type.dao');
const ConsentDocumentDAO = require('./consent-document.dao');
const ConsentSignatureDAO = require('./consent-signature.dao');
const UserConsentDocumentDAO = require('./user-consent-document.dao');
const ConsentDAO = require('./consent.dao');
const LanguageDAO = require('./language.dao');
const FileDAO = require('./file.dao');

const doasPerSchema = function (db, daosGenerator) {
    const consentType = new ConsentTypeDAO(db);
    const consentDocument = new ConsentDocumentDAO(db, { consentType });
    const consentSignature = new ConsentSignatureDAO(db);
    const userConsentDocument = new UserConsentDocumentDAO(db, { consentDocument });
    const user = new UserDAO(db, { consentDocument });
    const auth = new AuthDAO(db);
    const consent = new ConsentDAO(db, { consentDocument });
    const language = new LanguageDAO(db);
    const file = new FileDAO(db);

    return {
        sequelize: db.sequelize,
        user,
        auth,
        consentType,
        consentDocument,
        consentSignature,
        userConsentDocument,
        consent,
        language,
        file,
    };
};

module.exports = function daosGenerator(db) {
    if (db.schemas) {
        const result = db.schemas.reduce((r, schema) => {
            r[schema] = doasPerSchema(db[schema]);
            r.generator = daosGenerator;
            return r;
        }, {});
        return Object.assign({ sequelize: db.sequelize }, result);
    }
    const daos = doasPerSchema(db, daosGenerator);
    return Object.assign({ generator: daosGenerator }, daos);
};
