#! /usr/bin/env node
/**
 *
 * 读取modules下面的子目录的列表
 * 命令行界面交互选择
 * 生成entry模块,并配置对所选择的module的引用 *
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


program.usage('[entry-name]')
program.parse(process.argv)

var rawName = program.args[0];
var fileConfig ={
    src:path.join(__dirname, '../templates/entry/tpls'),
    dest:path.join(path.resolve('src/entry'),rawName)
}




getMods().then(function (list) {
    console.log(list)
    inquirer.prompt([{
        type: 'checkbox',
        choices: list,
        message: 'which module to use:',
        name: 'mods'
    }]).then(function (answers) {

        if (answers.mods.length > 0) {
            run(answers.mods);
        } else {
            console.warn("您没有选择模块,生成后请自行配置")
            run([]);
        }
    })
})




function run(mods) {
    console.log(mods)


    var metalsmith = Metalsmith(path.join(fileConfig.src))
    metalsmith.metadata({
        mods:mods
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
            //console.log(files)
            if(err){
                console.error(err);
            }else{
                console.success(rawName + " create success")
            }

        })


}

