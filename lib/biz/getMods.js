var getDirList = require('../util/getDirList')
var fs = require("fs-extra")
var path = require("path");

module.exports = function () {
    var modulePath = path.resolve("src/modules");
    return getDirList(modulePath);
}
