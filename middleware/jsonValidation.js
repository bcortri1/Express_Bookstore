const jsonschema = require("jsonschema");
const newBookSchema = require("../schemas/newBookSchema.json");
const updateBookSchema = require("../schemas/updateBookSchema.json");
const ExpressError = require("../expressError");

function newBookValid(req, res, next) {
    const result = jsonschema.validate(req.body, newBookSchema);
    if (!result.valid) {
        let listOfErrors = result.errors.map(error => error.stack);
        let error = new ExpressError(listOfErrors, 400);
        return next(error);
    }
    next();
};

function updateBookValid(req, res, next) {
    const result = jsonschema.validate(req.body, updateBookSchema);
    if (!result.valid) {
        let listOfErrors = result.errors.map(error => error.stack);
        let error = new ExpressError(listOfErrors, 400);
        return next(error);
    }
    next();
};


module.exports = {newBookValid, updateBookValid};