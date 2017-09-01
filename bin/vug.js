#! /usr/bin/env node
var path = require('path')
const fs = require('fs-extra')
const exec = require('child_process').exec
var console = require('chalk-console')

var arguments = process.argv.splice(2);

var argv = require('yargs-parser')(arguments)

function genFile(tplfile, target) {
    var source = path.join(__dirname, tplfile)
    fs.copy(source, target)
        .then(() => console.success(target + ' generate success!',true))
        .catch(err => console.error(err))
}

const getFilename = (arg) => {
    const arr = arg.split('/')
    return arr[arr.length - 1]
}




var command = arguments[0]
var filepath = arguments[1]

if (command === 'component') {
    genFile('../template/tpl.vue', 'src/' + filepath + ".vue");
} else if (command === "filter") {
    genFile('../template/filter.tpl.js', 'src/' + filepath + ".filter.js");
} else if (command === "directive") {
    genFile('../template/directive.tpl.js', 'src/' + filepath + ".directive.js");
} else if (command === 'module') {

} else if (command == 'new') {

}

