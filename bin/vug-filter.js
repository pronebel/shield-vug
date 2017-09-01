#! /usr/bin/env node

var console = require('chalk-console')
var genFile = require('../lib/gen-file')


var arguments = process.argv.splice(2);
var filepath = arguments[0];

if (filepath.indexOf("filters") == -1) {
    console.error("filter file must in the filter directory")

} else {


    genFile('../templates/file/filter.tpl.js', 'src/' + filepath + ".filter.js");

}






