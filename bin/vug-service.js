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



var genFile = require('../lib/gens/gen-file')


var arguments = process.argv.splice(2);
var filepath = arguments[0];

genFile('../templates/entry', 'src/entry/' + filepath + "");

