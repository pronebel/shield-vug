var chalk = require('chalk')
var Metalsmith = require('metalsmith')
var Handlebars = require('./util/handerbars')
var async = require('async')
var render = require('consolidate').handlebars.render
var path = require('path')
var multimatch = require('multimatch')
var getOptions = require('./util/options')
var ask = require('./util/ask')
var filter = require('./util/filter')
var logger = require('./util/logger')



/**
 * Generate a template given a `src` and `dest`.
 *
 * @param {String} name
 * @param {String} src
 * @param {String} dest
 * @param {Function} done
 */

module.exports = function generate(name, src, dest, done) {

    var opts = getOptions(name, src)
    var metalsmith = Metalsmith(path.join(src))

    var data = Object.assign(metalsmith.metadata(), {
        destDirName: name,
        inPlace: dest === process.cwd(),
        noEscape: true
    })


    var helpers = {chalk, logger}

    if (opts.metalsmith && typeof opts.metalsmith.before === 'function') {
        opts.metalsmith.before(metalsmith, opts, helpers)
    }

    metalsmith.use(askQuestions(opts.prompts))
        .use(filterFiles(opts.filters))
        .use(renderTemplateFiles(opts.skipInterpolation))

    if (typeof opts.metalsmith === 'function') {
        opts.metalsmith(metalsmith, opts, helpers)
    } else if (opts.metalsmith && typeof opts.metalsmith.after === 'function') {
        opts.metalsmith.after(metalsmith, opts, helpers)
    }

    metalsmith.clean(false)
        .source('.') // start from template root instead of `./src` which is Metalsmith's default for `source`
        .destination(dest)
        .build(function (err, files) {
            done(err)
            if (typeof opts.complete === 'function') {
                var helpers = {chalk, logger, files}
                opts.complete(data, helpers)
            } else {
                logMessage(opts.completeMessage, data)
            }
        })

    return data
}

/**
 * Create a middleware for asking questions.
 *
 * @param {Object} prompts
 * @return {Function}
 */

function askQuestions(prompts) {
    return function (files, metalsmith, done) {
        ask(prompts, metalsmith.metadata(), done)
    }
}

/**
 * Create a middleware for filtering files.
 *
 * @param {Object} filters
 * @return {Function}
 */

function filterFiles(filters) {
    return function (files, metalsmith, done) {
        filter(files, filters, metalsmith.metadata(), done)
    }
}

/**
 * Template in place plugin.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */

function renderTemplateFiles(skipInterpolation) {
    skipInterpolation = typeof skipInterpolation === 'string'
        ? [skipInterpolation]
        : skipInterpolation
    return function (files, metalsmith, done) {
        var keys = Object.keys(files)
        var metalsmithMetadata = metalsmith.metadata()
        async.each(keys, function (file, next) {
            // skipping files with skipInterpolation option
            if (skipInterpolation && multimatch([file], skipInterpolation, {dot: true}).length) {
                return next()
            }
            var str = files[file].contents.toString()
            // do not attempt to render files that do not have mustaches
            if (!/{{([^{}]+)}}/g.test(str)) {
                return next()
            }
            render(str, metalsmithMetadata, function (err, res) {
                if (err) {
                    err.message = `[${file}] ${err.message}`
                    return next(err)
                }
                files[file].contents = new Buffer(res)
                next()
            })
        }, done)
    }
}

/**
 * Display template complete message.
 *
 * @param {String} message
 * @param {Object} data
 */

function logMessage(message, data) {
    if (!message) return
    render(message, data, function (err, res) {
        if (err) {
            console.error('\n   Error when rendering template complete message: ' + err.message.trim())
        } else {
            console.log('\n' + res.split(/\r?\n/g).map(function (line) {
                return '   ' + line
            }).join('\n'))
        }
    })
}
