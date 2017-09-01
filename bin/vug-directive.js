#! /usr/bin/env node

var console = require('chalk-console')
var genFile = require('../lib/gen-file')


var arguments = process.argv.splice(2);
var filepath = arguments[0];

if (filepath.indexOf("directives") == -1) {
    console.error("directive file must in the directive directory")

} else {

    genFile('../templates/file/directive.tpl.js', 'src/' + filepath + ".directive.js");


}




