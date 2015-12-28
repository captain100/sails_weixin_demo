var request = require('request');
var wechat = require('wechat');
var wechat_config = {
    token: 'testnewqiushi',//开发者 token
    appid: 'wxb4fb29266130bb85',// appid
    encodingAESKey: 'BahC4uNa3dY6wo5U3mRpVf4yxkQtXs6OyDXEe2GudmR'//encodingAESKey
};

module.exports = {
    'wechat': function (req, res, next) {
        console.log('---------23213-------');
        res.end();
    }

}