/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * Helper methods for route logic.
 *
 * @version 1.0
 * @author peakpado
 */
'use strict';

var errors = require('common-errors');
var middleware = require('./middleware');


exports.createError = function(message, statusCode) {
  var err = new errors.Error(message);
  if (statusCode) {
    err.statusCode = statusCode;
  }
  return err;
};

/**
 * return the req parameter key or foreign key from model name
 * @param refModel the model object
 */
exports.getRefIdField = function(refModel) {
  var name = refModel.name;
  return name.charAt(0).toLowerCase() + name.slice(1) + 'Id';
};

exports.middleware = middleware;
