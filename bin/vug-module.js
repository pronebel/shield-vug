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

var genFile = require('../lib/gen-file')


var arguments = process.argv.splice(2);
var filepath = arguments[0];

genFile('../templates/mod', 'src/modules/' + filepath + "");

