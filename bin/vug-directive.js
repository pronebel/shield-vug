#! /usr/bin/env node
var argv = require('yargs-parser')(arguments)
var genFile = require('../lib/gen-file')


var arguments = process.argv.splice(2);
var filepath = arguments[0];

genFile('../templates/directive.tpl.js', 'src/' + filepath + ".directive.js");

