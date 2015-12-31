
module.exports.policies = {
    '*': true,
    WeChatController: {
        // Prevent end users from doing CRUD operations on products reserved for admins
        // (uses HTTP basic auth)
        '*':'WechatPolicie' 
        // Everyone can view product pages
    }
}