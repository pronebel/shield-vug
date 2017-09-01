#! /usr/bin/env node
var genFile = require('../lib/gen-file')


var arguments = process.argv.splice(2);
var filepath = arguments[0];

genFile('../templates/filter.tpl.js', 'src/' + filepath + ".filter.js");

