'use strict';

module.exports = {
    ErrorModel: _ErrorModel
};

function _ErrorModel(code, message) {
    this.code = code;
    this.message = message;
}

