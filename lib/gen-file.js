
var console = require('chalk-console')

var path = require('path')
const fs = require('fs-extra')


module.exports =  function genFile(tplfile, target) {
    var source = path.join(__dirname, tplfile)

    fs.copy(source, target, err => {
        if (err) return console.error(err)

        console.success(target + ' generate success!',true)
    })

}
