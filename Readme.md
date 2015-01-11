serenity route helper
---

Common module for serenity applications.

This module act as a middleware in express applications and processes the data (error) in object in express request instance and outputs the json to client.

The output format is standardized pre-defined format as per the appirio specifications.


### How to use ?

Add a dependency to serenity-route-helper in package.json

```
"serenity-route-helper": "git+ssh://git@gitlab.com:spanhawk/serenity-route-helper.git"
```

Run ```npm install``` to install it.

You can also do

```
npm install git+ssh://git@gitlab.com:spanhawk/serenity-route-helper.git --save
```

The ```--save``` flag automatically add it as dependency in package.json

Add serenity-route-helper in your code via ```require``` and create an instance to use it.


```
var serenityRouteHelper = require('serenity-route-helper');
var routeHelper = new serenityRouteHelper();
```

The module exports an error handler function which can be used as a middleware.

```
app.use(routeHelper.errorHandler);
```

Method description

- addError
- addErrorMessage
- addValidationError
- renderJson

The modules exports some common properties to be used across applications, they are defined below

Property Description

- HTTP_OK

  HTTP OK STATUS CODE (200)
- HTTP_NOT_FOUND

  HTTP NOT FOUND STATUS CODE (404)
- HTTP_UNAUTHORIZED

  HTTP UNAUTHORIZED STATUS CODE (401)
- HTTP_FORBIDDEN

  HTTP FORBIDDEN STATUS CODE (403)
- HTTP_CREATED

  HTTP RESOURCE CREATE STATUS CODE (201)
- HTTP_INTERNAL_SERVER_ERROR

  HTTP INTERNAL SERVER ERROR CODE
- HTTP_BAD_REQUEST

  HTTP BAD REQUEST STATUS CODE

### Example

Sample implementation examples are explained below

```
var serenityRouteHelper = require('serenity-route-helper');
var routeHelper = new serenityRouteHelper();

// some app.js part
// add global error handler
app.use(routeHelper.errorHandler);
// add common renderJson middleware
app.use(routeHelper.renderJson);
```

NOTE: Add the renderJson middleware at the end of chain. All the request processing should be completed before the ```routeHelper``` process the request.
```req.data``` or ```req.error``` should be set with the data to be sent to client or error to be sent to client.

serenityRouteHelper can be used directly in other files. It exposes middleware functions which can be added to express ```request``` instance anywhere in code

```
var serenityRouteHelper = require('serenity-route-helper');
var routeHelper = new serenityRouteHelper();

// controller validation
// some validation logic
if(invalid) {
  // the below will define and add an error object to request instance.
    // As explained above the default http status code for validation error is 400
  routeHelper.addValidationError(req, 'name is required');
    // calling next here will invoke the renderJson
    next();
}
```