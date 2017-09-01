#!/usr/bin/env node

require('commander')
    .version(require('../package').version)
    .usage('<command> [options]')
    .command('init', 'generate a new project from a template')
    .command('component', 'generate yours.vue ')
    .command('filter', 'generate yours.filter.js')


    .command('module', 'generate yours module')
    .command('entry', 'generate entry module')

    .parse(process.argv)
