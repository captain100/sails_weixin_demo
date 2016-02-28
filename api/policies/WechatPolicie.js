var request = require('request');
var wechat = require('wechat');
var wechat_config = {
    token: 'nj8sJ8YyNuxJCc',//开发者 token
    appid: 'wxb4fb29266130bb85',// appid
    encodingAESKey: 'BahC4uNa3dY6wo5U3mRpVf4yxkQtXs6OyDXEe2GudmR'//encodingAESKey
};

module.exports = function (req, res, next) {
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
                next();
            })
            
        // } else if (message.Event === 'VIEW') {
        //     var openid = message.FromUserName;
        //     request('http://localhost:3001/userinfo?openid=' + openid, function (error, response, info) {
        //         next();
        //     })

        } else {
            res.reply({
                content: '欢迎你加入由XX公司提供的XX试验。在此之前请确认你是否已经在你的主治医师的指导下签署书面合同已经签署请\n回复：是\n否则请联系你的主治医师',
                type: 'text'
            });
        }
    })(req, res, next)
}