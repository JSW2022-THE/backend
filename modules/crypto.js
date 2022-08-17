
const crypto = require('crypto')

const algorithm = 'aes-256-cbc'
const key = process.env.ENCRYPT_KEY
const iv = process.env.ENCRYPT_IV

const encrypt = (data) => {
    //console.log('암호화: '+data)
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let result = cipher.update(data, 'utf8', 'base64') + cipher.final('base64')
    return result
}

const decrypt = (data) => {
    //console.log('복호화: '+data)
    let decipher = crypto.createDecipheriv(algorithm, key, iv)
    let result = decipher.update(data, 'base64', 'utf8') + decipher.final('utf8')
    return result
}

module.exports.encrypt = encrypt
module.exports.decrypt = decrypt
