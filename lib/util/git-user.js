var exec = require('child_process').execSync

/**
 * 获取当前git的name,email信息
 * @returns {*}
 */
module.exports = function () {
  var name
  var email

  try {
    name = exec('git config --get user.name')
    email = exec('git config --get user.email')
  } catch (e) {}

  name = name && JSON.stringify(name.toString().trim()).slice(1, -1)
  email = email && (' <' + email.toString().trim() + '>')
  return (name || '') + (email || '')
}
