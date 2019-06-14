'use strict';

const config = require('../../config');

const sequelizeGenerator = require('./sequelize-generator');
const user = require('./user.model');
const consentType = require('./consent-type.model');
const consentTypeText = require('./consent-type-text.model');
const consentDocument = require('./consent-document.model');
const consentDocumentText = require('./consent-document-text.model');
const consentSignature = require('./consent-signature.model');
const consentSection = require('./consent-section.model');
const consent = require('./consent.model');
const language = require('./language.model');
const consentRole = require('./consent-role.model');

const defineTables = function (sequelize, Sequelize, schema) {
    const User = user(sequelize, Sequelize, schema);
    const ConsentRole = consentRole(sequelize, Sequelize, schema);
    const ConsentType = consentType(sequelize, Sequelize, schema);
    const ConsentTypeText = consentTypeText(sequelize, Sequelize, schema);
    const ConsentDocument = consentDocument(sequelize, Sequelize, schema);
    const ConsentDocumentText = consentDocumentText(sequelize, Sequelize, schema);
    const ConsentSignature = consentSignature(sequelize, Sequelize, schema);
    const ConsentSection = consentSection(sequelize, Sequelize, schema);
    const Consent = consent(sequelize, Sequelize, schema);
    const Language = language(sequelize, Sequelize, schema);

    return {
        sequelize,
        User,
        ConsentType,
        ConsentTypeText,
        ConsentDocument,
        ConsentDocumentText,
        ConsentSignature,
        ConsentSection,
        Consent,
        Language,
        ConsentRole,
        schema,
    };
};

module.exports = function dbGenerator(inputSchema, inputDbName) {
    if (inputSchema && Array.isArray(inputSchema)) {
        const { Sequelize, sequelize } = sequelizeGenerator(true, inputDbName);
        const tables = inputSchema.reduce((r, schema) => {
            const schemaTables = defineTables(sequelize, Sequelize, schema);
            r[schema] = schemaTables;
            return r;
        }, {});
        return Object.assign({ sequelize }, { schemas: inputSchema }, tables);
    }
    const schema = inputSchema || config.db.schema;
    const { Sequelize, sequelize } = sequelizeGenerator(schema !== 'public', inputDbName);
    const schemaTables = defineTables(sequelize, Sequelize, schema);
    return Object.assign({ sequelize, generator: dbGenerator }, schemaTables);
};
