#! /usr/bin/env node
/**
 *
 * 设计思路:
 * - modules下添加module模块
 * - 更新 mod 配置表,当生产entry时,可以选择mod模块,并动态配置entry的模块的router配置引用
 *
 *
 *
 */
var path = require("path");
var console = require('chalk-console');
var fs = require("fs-extra")
var program = require('commander')
var inquirer = require('inquirer');
var Metalsmith = require('metalsmith')
var async = require('async')
var render = require('consolidate').handlebars.render
var Handlebars = require('../lib/util/handerbars')
var getMods = require('../lib/biz/getMods')



program.usage('[module-name]')
program.parse(process.argv)

var moduleName = program.args[0];
var fileConfig ={
    src: path.join(__dirname, '../templates/mod'),
    dest:path.join(path.resolve('src/modules'),moduleName)
}

console.log(fileConfig)


run();




function run() {


    var metalsmith = Metalsmith(path.join(fileConfig.src))
    metalsmith.metadata({
        name:moduleName
    })
    metalsmith.use(function (files, metalsmith, done) {
        var keys = Object.keys(files)
        var metalsmithMetadata = metalsmith.metadata()
        async.each(keys, function (file, next) {

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
    })



    metalsmith.clean(false)
        .source('.')
        .destination(fileConfig.dest)
        .build(function (err, files) {

            if(err){
                console.error(err);
            }else{
                console.success(moduleName + " created success")
            }

        })


}


