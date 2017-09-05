#! /usr/bin/env node
/**
 *
 * 读取modules下面的子目录的列表
 * 命令行界面交互选择
 * 生成entry模块,并配置对所选择的module的引用
 *
 *
 *
 *
 */
var path = require("path");
var console = require('chalk-console');
var fs = require("fs-extra")
var chalk = require('chalk')
var program = require('commander')
var inquirer = require('inquirer');
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
 * Usage.
 */

program.usage('[entry-name]')

program.parse(process.argv)


var modulePath = path.resolve("src/modules");

fs.readdir(modulePath, function (err, files) {
    if (err) {
        console.log(err);
    }
    chooseList(files);
})

function chooseList(list) {
    inquirer.prompt([{
        type: 'checkbox',
        choices: list,
        message: 'which module to use:',
        name: 'mods'
    }]).then(function (answers) {

        if (answers.mods.length > 0) {
            run();
        } else {
            console.warn("您没有选择模块,生成后请自行配置")
            run();
        }
    })
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
 * Generate a template given a `src` and `dest`.
 *
 * @param {String} name 生成的文件夹名
 * @param {String} src 源目录
 * @param {String} dest 目标目录
 * @param {Function} done
 */

 function generate(name, src, dest, done) {

    /**
     * 获取 meta信息列表(也作为页面模板的渲染数据)
     * @type {Object|opts}
     */
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
                console.log("success")
            }
        })

    return data
}





function run() {
    var rawName = program.args[0]
    genFile('../templates/entry', 'src/entry/' + rawName + "");
    //generate()
}

