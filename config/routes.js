/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {
    //SystemController
    'all /': 'SystemController.showExpress',
    'get /heartqOl': 'SystemController.heartqOl',
    'get /subPaper': 'SystemController.submitQuestion',
    'get /admin': 'SystemController.showAdmin',
    'get /new':'SystemController.createQuestion', 
    'get /getQuestion':'SystemController.findQuestion',
    'get /list':'SystemController.findAllQuestion',
    'post /insert':'SystemController.insertQuestion', 
    'post /template/:openid':'SystemController.pushTemplateMSG',
    'get /createTask':'SystemController.createTask',
    'get /schedule':'SystemController.getSchedule',
    'get /updateStatus':'SystemController.changeActionStatus',
    //wechatController
    'all /wechat':'WeChatController.wechat',
    'get /project':'SystemController.findAllProject',
    'get /createProject':'SystemController.createProject',
    'get /getActionList':'SystemController.getActionList',
    //project
    '/insertProject':'ProjectController.insertProject',
    '/getProjectNo':'ProjectController.getProjectNo',
    //userinfo
    'get /userinfo':'SystemController.getUserinfo',
    //修改微信menu菜单
    '/updateWeixinMenu':'SystemController.updateWeixinMenu',
    //进入userinfo的界面
    '/showUserinfo':'SystemController.showUserinfo',
    //注册用户
    '/registWechatUser':'SystemController.registWechatUser'
    



};
