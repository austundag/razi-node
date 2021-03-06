'use strict';

const _ = require('lodash');

const shared = require('./shared.js');

exports.listUserConsentDocuments = function listUserConsentDocuments(req, res) {
    const { id: userId, role } = req.user;
    const options = {
        role,
        language: _.get(req, 'swagger.params.language.value'),
        includeSigned: _.get(req, 'swagger.params.include-signed.value'),
        roleOnly: _.get(req, 'swagger.params.role-only.value'),
    };
    req.models.userConsentDocument.listUserConsentDocuments(userId, options)
        .then(consentDocuments => res.status(200).json(consentDocuments))
        .catch(shared.handleError(req, res));
};

exports.getUserConsentDocument = function getUserConsentDocument(req, res) {
    const id = _.get(req, 'swagger.params.id.value');
    const language = _.get(req, 'swagger.params.language.value');
    req.models.userConsentDocument.getUserConsentDocument(req.user.id, id, { language })
        .then(result => res.status(200).json(result))
        .catch(shared.handleError(req, res));
};

exports.getUserConsentDocumentByTypeId = function getUserConsentDocumentByTypeId(req, res) {
    const userId = req.user.id;
    const typeId = _.get(req, 'swagger.params.typeId.value');
    const language = _.get(req, 'swagger.params.language.value');
    req.models.userConsentDocument.getUserConsentDocumentByTypeId(userId, typeId, { language })
        .then(result => res.status(200).json(result))
        .catch(shared.handleError(req, res));
};
