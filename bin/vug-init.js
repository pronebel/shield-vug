#!/usr/bin/env node

var download = require('download-git-repo')
var program = require('commander')
var exists = require('fs').existsSync
var path = require('path')
var ora = require('ora')
var home = require('user-home')
var chalk = require('chalk')
var inquirer = require('inquirer')
var rm = require('rimraf').sync
var logger = require('../lib/util/logger')
var generate = require('../lib/generate')
//var checkVersion = require('../lib/check-version')

var localPath = require('../lib/local-path')

var isLocalPath = localPath.isLocalPath
var getTemplatePath = localPath.getTemplatePath

/**
 * Usage.
 */

program
    .usage('[project-name]')

/**
 * Help.
 */

program.on('--help', function () {
    console.log('  Examples:')
    console.log()
    console.log(chalk.gray('    # create a new project with an official template'))
    console.log('    $ vug init my-project')
    console.log()
})

/**
 * Help.
 */

function help () {
    program.parse(process.argv)
    if (program.args.length < 1) return program.help()
}
help()

/**
 * Settings.
 */


var rawName = program.args[0]
var inPlace = !rawName || rawName === '.'
var name = inPlace ? path.relative('../', process.cwd()) : rawName
var to = path.resolve(rawName || '.')


/**
 * Padding.
 */

console.log()
process.on('exit', function () {
    console.log()
})

if (exists(to)) {
    inquirer.prompt([{
        type: 'confirm',
        message: inPlace
            ? 'Generate project in current directory?'
            : 'Target directory exists. Continue?',
        name: 'ok'
    }], function (answers) {
        if (answers.ok) {
            run()
        }
    })
} else {
    run()
}

/**
 * Check, download and generate the project.
 */

function run () {
    var templateCache = path.join(home, '.vug-template','vue-seed')
    var spinner = ora('downloading...')
    spinner.start()
    if (exists(templateCache)) rm(templateCache)
    download('pronebel/vue-seed', templateCache, function (err) {
        spinner.stop()
        if (err) logger.fatal('Failed to download '+ ': ' + err.message.trim())

        console.log(to)
        generate(name, templateCache, to, function (err) {
            if (err) logger.fatal(err)
            console.log()
            logger.success('Generated "%s".', name)
        })
    })

}

