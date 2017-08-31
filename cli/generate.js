#! /usr/bin/env node
var path = require('path')
const fs = require('fs-extra')
const exec = require('child_process').exec

var arguments = process.argv.splice(2);

var argv = require('yargs-parser')(arguments)

function genFile(tplfile,target){
  var source = path.join(__dirname, tplfile)
  fs.copy(source, target)
    .then(() => console.log(target+ ' generate success!'))
    .catch(err => console.error(err))
}

const getFilename = (arg) => {
  const arr = arg.split('/')
  return arr[arr.length - 1]
}


console.log(argv)

let command = arguments[0]
let filepath = arguments[1]

if(command==='component'){
  genFile('/file/tpl.vue','src/' + filepath+".vue");
}else if(command ==="filter") {
  genFile('/file/filter.tpl.js','src/' + filepath+".filter.js");
}else if(command ==="directive") {
  genFile('/file/directive.tpl.js','src/' + filepath+".directive.js");
}

