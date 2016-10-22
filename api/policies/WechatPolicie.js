var request = require('request');
var wechat = require('wechat');
var wechat_config = {
    token: 'nj8sJ8YyNuxJCc',//开发者 token
    appid: 'wxb4fb29266130bb85',// appid
    encodingAESKey: 'BahC4uNa3dY6wo5U3mRpVf4yxkQtXs6OyDXEe2GudmR'//encodingAESKey
};

module.exports = function (req, res, next) {
    var i = 1
    wechat(wechat_config, function (req, res, next) {
        // console.log(11111111111);
        // 微信输入信息都在req.weixin上
        var message = req.weixin;
        // console.log(message);
        if (message.Content === 'qiushi') {
            // 回复qiushi(普通回复)
            res.reply('hehe');

        } else if (message.Event === 'CLICK' && message.EventKey === 'CREAT_TASK_1') {

            var openid = message.FromUserName;
            request('http://www.cpzero.cn/createTask?openid=' + openid, function (error, response, info) {
                console.log('调用', i)               
                next();
            })

        } else {
            res.reply({
                content: 'Welcome to WeHEOR. Please make sure that you have assigned the agreement under the instruction of your doctor. If not, please contact your doctor.',
                type: 'text'
            });
        }
    })(req, res, next)
}