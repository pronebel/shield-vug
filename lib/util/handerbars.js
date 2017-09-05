var Handlebars = require('handlebars')

// register handlebars helper
Handlebars.registerHelper('if_eq', function (a, b, opts) {
    return a === b
        ? opts.fn(this)
        : opts.inverse(this)
})

Handlebars.registerHelper('unless_eq', function (a, b, opts) {
    return a === b
        ? opts.inverse(this)
        : opts.fn(this)
})
Handlebars.registerHelper('if_or', function (v1, v2, options) {
    if (v1 || v2) {
        return options.fn(this);
    }

    return options.inverse(this);
})



module.exports =  Handlebars;
