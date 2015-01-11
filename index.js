'use strict';
/**
 * Common route helper module for serenity applications
 * @author    0.0.1
 * @version   spanhawk
 */

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Constructor function
 */
var serenityRouteHelper = function() {

};

/**
 * Exporting HTTP STATUS CODES
 */
serenityRouteHelper.prototype.HTTP_OK = 200;
serenityRouteHelper.prototype.HTTP_NOT_FOUND = 404;
serenityRouteHelper.prototype.HTTP_UNAUTHORIZED = 401;
serenityRouteHelper.prototype.HTTP_FORBIDDEN = 403;
serenityRouteHelper.prototype.HTTP_CREATED = 201;
serenityRouteHelper.prototype.HTTP_BAD_REQUEST = 400;
serenityRouteHelper.prototype.HTTP_INTERNAL_SERVER_ERROR = 500;

/**
 * Public functions
 */

/**
 * Function to add eror object to express request instance
 * The err can be an array
 * If no errCode is mentioned than this method tries to guess errCode from err.message
 * The default code would be 500 if no errCode is guessed
 *
 * @param {Object}    req       Express request instance
 * @param {Object}    err       error Object/Array to be add to request instance
 * @param {Number}    errCode   errCode Optional. If errCode is specified than this errCode would take precedance
 *                              over 500 and guessed errCode. The priorites are in following order
 *                              errCode > req.error.code > guessed error code > 500
 */
serenityRouteHelper.prototype.addError = function(req, err, errCode) {
  req.error = {};
  var errorCode;
  console.log('Error:');
  console.log(err);

  if(err instanceof Array) {   // Sequelize returns array
    req.error.message = err[0].message;
    if (req.error.message.indexOf('violates') > -1 || req.error.message.indexOf('constraint') > -1) {
      errorCode = this.HTTP_BAD_REQUEST;  // return bad request
    }
  } else if (err.errors && err.errors instanceof Array) {
    req.error.errors = err.errors;
  } else if (err.message) {
    req.error.message = err.message;
    if (req.error.message.indexOf('violates') > -1 || req.error.message.indexOf('constraint') > -1) {
      errorCode = this.HTTP_BAD_REQUEST;  // return bad request
    }
  } else if (typeof err === 'string') {  // error from a127 middleware validation error
      req.error.message = err;
  } else {
    req.error.message = 'request failed';
  }
  req.error.code = errCode || req.error.code || errorCode || this.HTTP_INTERNAL_SERVER_ERROR;
};

/**
 * Add an error with given error message
 * @param {Object}    req       Express request instance
 * @param {String}    errMsg    Error message to add
 * @param {Number}    errCode   Error code defaults to 500
 */
serenityRouteHelper.prototype.addErrorMessage = function(req, errMsg, errCode) {
  req.error = {};
  req.error.message = errMsg;
  req.error.code = errCode || req.error.code || this.HTTP_INTERNAL_SERVER_ERROR;
};

/**
 * Add an validation error to the request instance with given validation error message.
 * The default status code for validation error is 400
 *
 * @param {Object}    req       Express request instance
 * @param {String}    errMsg    Validation error message
 */
serenityRouteHelper.prototype.addValidationError = function(req, errMsg) {
  if (!req.error) {
    req.error = {};
  }
  if (!req.error.errors) {
    req.error.errors = [];
  }
  req.error.code = this.HTTP_BAD_REQUEST;
  var exist = false;
  _.forEach(req.error.errors, function(errorMsg) {
    if(errorMsg.toString().indexOf(errMsg)!==-1){
      exist = true;
    }
  });
  if(!exist) {
    req.error.errors.push(new Error(errMsg));
  }
};

/**
 * Processes the error or data in the instance object and send to client in pre-defined specified format
 *
 * @param {Object}    req       Express request instance
 * @param {Object}    res       Express response instance
 */
serenityRouteHelper.prototype.renderJson = function(req, res) {
  if (req.error) {
    if (req.error.errors) {   // validation errors
      res.status(req.error.code).json({
        result: {
          success: false,
          status : req.error.code
        },
        content : _.pluck(_.values(req.error.errors), 'message').join('. '),
        details: req.error.errors
      });
    } else {
      res.status(req.error.code).json({
        result: {
          success: false,
          status : req.error.code
        },
        content : req.error.message
      });
    }
  } else if (req.data) {
    res.status(this.HTTP_OK).json(req.data);
  } else {
    res.status(this.HTTP_NOT_FOUND).json({
      result: {
        success: false,
        status : this.HTTP_NOT_FOUND
      },
      content: 'The resource is not found'
    });
  }
};

/**
 * Generic error handling middleware.
 *
 * @param {Object}    err       The error object
 * @param {Object}    req       Express request instance
 * @param {Object}    res       Express response instance
 * @param {Function}  next      the next function
 */
serenityRouteHelper.prototype.errorHandler = function(err, req, res, next) {
  if (err) {
    this.addError(req, err, this.HTTP_BAD_REQUEST);
  }
  next();
};

/**
 * Return the req parameter key or foreign key from model name
 *
 * @param   refModel    the model object
 */
serenityRouteHelper.prototype.getRefIdField = function(refModel) {
  var name = refModel.name;
  return name.charAt(0).toLowerCase() + name.slice(1) + 'Id';
};

module.exports = serenityRouteHelper;