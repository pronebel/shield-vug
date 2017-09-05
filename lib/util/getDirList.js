var fs = require("fs-extra")
module.exports = function (modulePath) {

    return new Promise(function(resolve, reject) {
        fs.readdir(modulePath, function (err, files) {
            if(err) return reject();
            resolve(update);
        })
    });
}
