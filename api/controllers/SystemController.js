var request = require('request');
var async = require('async');
var WechatAPI = require('wechat-api');
var config = require('sails').config;
var api = '';

module.exports = {
    //访问网站首页
    showExpress: function (req, res) {

        console.log(req);
        res.render('showPage');
    },
    //获取试卷数据信息
    heartqOl: function (req, res) {
        // console.log(sails.config);
        request.get({ url: config.server + '/info/paper/getPaperContent?paperId=' + req.query.paperId + '&taskNo=' + req.query.taskNo + '&userAccount=' + req.query.userAccount }, function (err, response, body) {
            console.log(body);
            body = JSON.parse(body);
            console.log(body.data);
            res.render('heartq_test', { data: body.data });
        })
    },
    //提交试卷数据
    submitQuestion: function (req, res) {
        var data = req.query.data;
        var json = JSON.stringify(data);
        json = JSON.parse(json);
        // console.log(json);
        var options = {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36'
            },
            url: config.server + '/info/paper/submit',
            method: 'POST',
            json: true,
            body: json
        };
        request(options, function (error, response, data) {
            if (!error && response.statusCode == 200) {
                console.log('----info------', data);
                res.json(200, { info: data });
            }
        });
    },
    //admin首页
    showAdmin: function (req, res) {
        res.render('admin', {});
    },
    //新建试卷页面
    createQuestion: function (req, res) {
        res.render('newqs', {});
    },
    // 通过id查询试卷
    findQuestion: function (req, res) {
        var paperId = req.query.paperId || 150;
        request.get(config.server + '/admin/paper/readDetail?paperId=' + paperId, function (err, response, data) {
            console.log(response);
            if (!err && response.statusCode == 200) {
                data = JSON.parse(data);
                console.log(data);
                res.render('question', { data: data.data });
            }
        });
    },
    //试卷列表
    findAllQuestion: function (req, res) {
        request.get(config.server + '/admin/paper/list?paperName=', function (error, response, data) {
            if (!error && response.statusCode == 200) {
                data = JSON.parse(data);
                console.log(data);
                res.render('list', { list: data.data });
            }
        });
    },
    findAllProject: function (req, res) {
        request.get(config.server + '/admin/project/list', function (error, response, data) {
            if (!error && response.statusCode == 200) {
                data = JSON.parse(data);
                console.log(data);
                res.render('project', { list: data.data });
            }
        });
    },
    
    //创建试卷接口
    insertQuestion: function (req, res) {
        var data = JSON.parse(req.body.data);
        console.log(data);
        var options = {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36'
            },
            url: config.server + '/admin/paper/create',//http://123.56.227.132:8080/admin/paper/create
            method: 'POST',
            json: true,
            body: data
        };
        request(options, function (error, response, data) {
            if (!error && response.statusCode == 200) {
                console.log('----info------', data);
                res.render('admin', {});
            }
        });
    },
    //推送模版消息
    pushTemplateMSG: function (req, res) {
        console.log('推送消息已到达')
        // console.log(req.body);
        api = new WechatAPI(config.APPID, config.APPSECRET);
        var templateId = '9JDP4C0Q82qwj9AdZEPfOphLrhg1APAanwFZHwA059s';
        // URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
        var url = req.body.redirectUrl;
        var data = {
            "first": {
                "value": req.body.msgTitle,
                "color": "#173177"
            },
            "keyword1": {
                "value": req.body.msgContent,
                "color": "#173177"
            },
            "keyword2": {
                "value": req.body.msgDueTime,
                "color": "#173177"
            },
            "remark": {
                "value": req.body.remark,
                "color": "#173177"
            }
        };
        var openid = req.param('openid');
        // console.log('openid', openid);
        api.sendTemplate(openid, templateId, url, data, function (err, result) {
            console.log('error', err);
            console.log('result', result);
            res.json(200, result);
        });
    },
    //createTask
    createTask: function (req, res, next) {
        var openid = req.query.openid;
        console.log(openid);
        request(config.server + '/info/task/createTaskList?userAccount=' + openid + '&projectUniqNo=123$1', function (error, response, info) {
            console.log(info);
            next();
        })
    },
    //schedule列表
    getSchedule: function (req, res) {
        var userAccount = req.query.userAccount;
        var projectUniqNo = req.query.projectUniqNo;
        var scheduleCount = req.query.scheduleCount;
        var url = config.server + "/info/task/userCurrentList?userAccount=" + userAccount + "&projectUniqNo=" + projectUniqNo + "&scheduleCount=" + scheduleCount;
        // console.log(url);
        async.parallel({
            data: function (cb) {
                request.get({ url: url }, function (error, response, info) {
                    if (error) res.json({ error: error });
                    if (!error && response.statusCode == 200) {
                        info = JSON.parse(info);
                        // console.log(info)
                        // res.render('schedule', {data: info.data});
                        cb(null, info.data);
                    }
                })
            },
            user: function (cb) {
                api = new WechatAPI(config.APPID, config.APPSECRET);
                api.getUser(userAccount, function (error, userInfo) {
                    console.log(error + ' |  ' + userInfo)
                    cb(null, userInfo);
                });
            }
        }, function (error, result) {
            // console.log(result)
            res.render('schedule', result);
        })
    },
    //修改题目状态
    changeActionStatus: function (req, res) {
        var taskNo = req.query.taskNo;
        var userAccount = req.query.userAccount;
        var projectUniqNo = req.query.projectUniqNo;
        var scheduleCount = req.query.scheduleCount;
        // http://123.56.126.231:8080/info/task/userCommitTask?taskNo='+taskNo+'&userAccount='+userAccount
        request.get(config.server + '/info/task/userCommitTask?taskNo=' + taskNo + '&userAccount=' + userAccount, function (error, response, info) {
            if (error) res.json({ error: error });
            if (!error && response.statusCode == 200) {
                console.log(info);
                res.redirect('/schedule?userAccount=' + userAccount + '&projectUniqNo=' + projectUniqNo + '&scheduleCount=' + scheduleCount)
            }
        })
    },
    //创建project页面
    createProject: function (req, res) {
        res.render('createProject');
    },
    getActionList: function (req, res) {
        request.get(config.server + '/admin/action/list', function (error, response, info) {
            if (error) res.json({ error: error });
            if (!error && response.statusCode == 200) {
                info = JSON.parse(info);
                console.log(info);
                res.json(info.data);
            }
        })
    },
    //进入个人主页
    getUserinfo: function (req, res) {
        console.log('openid', req.query.openid);
        res.render('userinfo', { projectId: '' });
    },
    //修改微信公众账号的菜单栏
    updateWeixinMenu: function (req, res) {
        console.log('>>>>>>>>>>>>>>>>>>>>>>')
        api = new WechatAPI(config.APPID, config.APPSECRET);
        api.removeMenu(function (err, result) {
            if (result) {
                var menu = {
                    "button": [
                        {
                            "type": "view",
                            "name": "个人主页",
                            "url":"http://www.cpzero.cn:3010/auth/wechat"
                        },
                        {
                            "type": "click",
                            "name": "立刻生成任务",
                            "key": "CREAT_TASK_1",
                        },
                    ]
                };
                api.createMenu(menu, function (err, result) {
                    if (err) return console.log(err);
                    return res.send(result);
                });
            }
        });
    }

}