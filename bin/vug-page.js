#! /usr/bin/env node

var console = require('chalk-console')
var genFile = require('../lib/gen-file')


var arguments = process.argv.splice(2);
var filepath = arguments[0];

if(filepath.indexOf("pages")==-1){
    console.error("page file must in the pages directory")

}else{

    genFile('../templates/file/page.vue', 'src/' + filepath + ".vue");

}



