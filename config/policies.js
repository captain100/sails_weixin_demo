var request = require('request');
var wechat = require('wechat');
var wechat_config = {
    token: 'nj8sJ8YyNuxJCc',//开发者 token
    appid: 'wxb4fb29266130bb85',// appid
    encodingAESKey: 'BahC4uNa3dY6wo5U3mRpVf4yxkQtXs6OyDXEe2GudmR'//encodingAESKey
};

module.exports.policies = {
    '*': true,
    WeChatController: {
        // Prevent end users from doing CRUD operations on products reserved for admins
        // (uses HTTP basic auth)
        '*':'WechatPolicie' 
        // Everyone can view product pages
    }
}