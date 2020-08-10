const { check, validationResult } = require("express-validator");

const asyncHandler = (handler) => {
    return function (req, res, next) {
        return handler(req, res, next).catch(next)
    }};

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);
    console.log(validationErrors);
    console.log(req.body);
    if (!validationErrors.isEmpty()) {
      const errors = validationErrors.array().map((error) => error.msg);

      const err = new Error("Bad request.");
      err.errors = errors;
      err.status = 400;
      err.title = "Bad request.";
      return next(err);
    }
    next();
  };

  module.exports = {
      asyncHandler,
      handleValidationErrors
  }
