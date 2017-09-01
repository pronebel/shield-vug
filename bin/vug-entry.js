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
var genFile = require('../lib/gen-file')
var inquirer = require('inquirer');

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


function run() {
    var rawName = program.args[0]
    genFile('../templates/entry', 'src/entry/' + rawName + "");
}

