/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * Common middiewares for lc projects.
 *
 * @author peakpado
 * @version 1.0
 */
'use strict';

var _ = require('lodash');
var errors = require('common-errors');

/**
 * This method renders result data as JSON.
 * The result data should be saved in req.data by upper layer logic.
 * @param req the request
 * @param res the response
 */
exports.renderJson = function(req, res) {

  if (req.data) {
    res.status(200).json(req.data);
  } else {
    // no data to send.
    res.status(200).end();
  }
};

/**
 * Error handling middleware that renders error as JSON.
 * @param err the error
 * @param req the request
 * @param res the response
 * @param next the next
 */
exports.errorHandler = function(err, req, res, next) {

  if (err) {
    if (err.code) {   // error from a127
      if (err.failedValidation) {
        err.statusCode = 400;
      } else {
        err.statusCode = 500;
      }
    } else if (err.errors) {  // validation error
      err.statusCode = 400;
      err.message = _.pluck(_.values(err.errors), 'message').join('. ');
    } else if (!err.statusCode) {  // from common-errors
      // translate common-errors to HTTP error to get HTTP status code
      var httpError = new errors.HttpStatusError(err);
      err.statusCode = httpError.statusCode;
    }

    res.status(err.statusCode).json({
      result: {
        success: false,
        status: err.statusCode,
        content: err.message
      }
    });
  } else {
    next();
  }
};
