var match = require('minimatch')
var evaluate = require('./eval')

/**
 *
 * @param files
 * @param filters:{
        ".eslintrc.js": "lint",
        ".eslintignore": "lint",
 * }
 * @param data
 * @param done
 * @returns {*}
 */
module.exports = function (files, filters, data, done) {
  if (!filters) {
    return done()
  }
  var fileNames = Object.keys(files)
  Object.keys(filters).forEach(function (glob) {
    fileNames.forEach(function (file) {
      if (match(file, glob, { dot: true })) {
        var condition = filters[glob]
        if (!evaluate(condition, data)) {
          delete files[file]
        }
      }
    })
  })
  done()
}
