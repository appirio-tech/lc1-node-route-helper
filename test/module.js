/* jshint unused:false */
/**
 * This module contains codes for testing serenity-route-helper module
 *
 * @version   0.0.1
 * @author    spanhawk
 */
'use strict';

var should = require('should');
var serenityRouteHelper = require('../');
var _ = require('lodash');

/**
 * Test Challenge model CRUD operations
 */
describe('<Module Test>', function() {
  describe('<Initiatization tests>', function() {
    it('should not throw error while instantiation', function(done) {
      try {
        var routeHelper = new serenityRouteHelper();
        done();
      } catch(e) {
        should.not.exist(e);
        done();
      }
    });
  });
  describe('<Functionality tests>', function() {
    var routeHelper;
    before(function() {
      routeHelper = new serenityRouteHelper();
    });

    it('HTTP STATUS CODES should be exported properly', function(done) {
      routeHelper.HTTP_OK.should.equal(200);
      routeHelper.HTTP_NOT_FOUND.should.equal(404);
      routeHelper.HTTP_UNAUTHORIZED.should.equal(401);
      routeHelper.HTTP_FORBIDDEN.should.equal(403);
      routeHelper.HTTP_CREATED.should.equal(201);
      routeHelper.HTTP_BAD_REQUEST.should.equal(400);
      routeHelper.HTTP_INTERNAL_SERVER_ERROR.should.equal(500);
      done();
    });

    it('should be able to add error', function(done) {
      var error = {
        code: routeHelper.HTTP_INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error'
      };
      // dummy request object
      var req = {};
      routeHelper.addError(req, error);
      should.exist(req.error);
      req.error.code.should.equal(error.code);
      done();
    });
    it('should be able to add error (error code priority test)', function(done) {
      var error = {
        code: routeHelper.HTTP_INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error'
      };
      var req = {};
      routeHelper.addError(req, error, routeHelper.HTTP_OK);
      should.exist(req.error);
      req.error.code.should.equal(routeHelper.HTTP_OK);
      done();
    });

    it('should be able to add error (error code guesssing priority test)', function(done) {
      var error = {
        message: 'Constraint violated'
      };
      var req = {};
      routeHelper.addError(req, error, routeHelper.HTTP_BAD_REQUEST);
      should.exist(req.error);
      req.error.code.should.equal(routeHelper.HTTP_BAD_REQUEST);
      done();
    });

    it('should be able to add validation error', function(done) {
      var req = {}, errorMessage = 'Required field id cannot be null';
      routeHelper.addValidationError(req, errorMessage);
      should.exist(req.error);
      req.error.code.should.equal(routeHelper.HTTP_BAD_REQUEST);
      done();
    });

    it('should be able to add error message', function(done) {
      var req = {}, errorMessage = 'File upload failed.';
      routeHelper.addErrorMessage(req, errorMessage, routeHelper.HTTP_INTERNAL_SERVER_ERROR);
      should.exist(req.error);
      req.error.code.should.equal(routeHelper.HTTP_INTERNAL_SERVER_ERROR);
      done();
    });
  });
});