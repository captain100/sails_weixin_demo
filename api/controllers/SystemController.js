var request = require('request');
var async = require('async');
var fs   = require('fs');
var WechatAPI = require('wechat-api');
var config = require('sails').config;
var api = '';
var OAuth = require('wechat-oauth');
var client = new OAuth('wxb4fb29266130bb85', '675f1cd7edfcaba17b987c44c83e0a6b');

module.exports = {
    //访问网站首页
    showExpress: function(req, res) {
        if (req.params.filename) {
            fs.exists(req.params.filename, function(exists) {
                if (exists) {
                    fs.readFile(req.params.filename, 'binary', function(err, file) { 
                        var contentType = "text/plain";
                        res.writeHead(200, {
                            'Content-Type': contentType,
                            'Connection': 'keep-alive',
                            'Transfer-Encoding': 'chunked'
                        });
                        res.write(file, "binary");
                        res.end();
                    })
                }
            })
        }
        else {
            res.render('showPage');

        }
    },
    //获取试卷数据信息
    heartqOl: function(req, res) {
        request.get({ url: config.server + '/info/paper/getPaperContent?paperId=' + req.query.paperId + '&taskNo=' + req.query.taskNo + '&userAccount=' + req.query.userAccount }, function(err, response, body) {
            body = JSON.parse(body);
            res.render('heartq_test', { data: body.data, scheduleCount: body.data.scheduleCount });
        })
    },
    //提交试卷数据
    submitQuestion: function(req, res) {
        var data = req.body;
        var json = JSON.stringify(data);
        json = JSON.parse(json);
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
        request(options, function(error, response, data) {
            if (!error && response.statusCode == 200) {
                res.json(200, { info: data });
            }
        });
    },
    //admin首页
    showAdmin: function(req, res) {
        res.render('admin', {});
    },
    //新建试卷页面
    createQuestion: function(req, res) {
        res.render('newqs', {});
    },
    // 通过id查询试卷
    findQuestion: function(req, res) {
        var paperId = req.query.paperId || 150;
        request.get(config.server + '/admin/paper/readDetail?paperId=' + paperId, function(err, response, data) {
            console.log(response);
            if (!err && response.statusCode == 200) {
                data = JSON.parse(data);
                console.log(data);
                res.render('question', { data: data.data });
            }
        });
    },
    //试卷列表
    findAllQuestion: function(req, res) {
        request.get(config.server + '/admin/paper/list?paperName=', function(error, response, data) {
            if (!error && response.statusCode == 200) {
                data = JSON.parse(data);
                console.log(data);
                res.render('list', { list: data.data });
            }
        });
    },
    //查询全部列表
    findAllProject: function(req, res) {
        request.get(config.server + '/admin/project/list', function(error, response, data) {
            if (!error && response.statusCode == 200) {
                data = JSON.parse(data);
                console.log(data);
                res.render('project', { list: data.data });
            }
        });
    },

    //创建试卷接口
    insertQuestion: function(req, res) {
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
        request(options, function(error, response, data) {
            if (!error && response.statusCode == 200) {
                console.log('----info------', data);
                res.render('admin', {});
            }
        });
    },
    //推送模版消息
    pushTemplateMSG: function(req, res) {
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
        api.sendTemplate(openid, templateId, url, data, function(err, result) {
            console.log('error', err);
            console.log('result', result);
            res.json(200, result);
        });
    },
    //createTask
    createTask: function(req, res, next) {
        var openid = req.query.openid;
        console.log(openid);
        request(config.server + '/info/task/createTaskList?userAccount=' + openid + '&projectUniqNo=123$1', function(error, response, info) {
            console.log(info);
            next();
        })
    },
    //schedule列表
    getSchedule: function(req, res) {
        var userAccount = req.query.userAccount;
        var projectUniqNo = req.query.projectUniqNo;
        var scheduleCount = req.query.scheduleCount;
        var url = config.server + "/info/task/userCurrentList?userAccount=" + userAccount + "&projectUniqNo=" + projectUniqNo + "&scheduleCount=" + scheduleCount;
        // console.log(url);
        async.parallel({
            data: function(cb) {
                request.get({ url: url }, function(error, response, info) {
                    if (error) res.json({ error: error });
                    if (!error && response.statusCode == 200) {
                        info = JSON.parse(info);
                        // console.log(info)
                        // info.data.listCount.map(function(item){
                        //     console.log(item)
                        //     return item.chDesc.replace(/&gt;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "\'").replace(/&quot;/g, "\"").replace(/<br>/g, "\n")
                        // })
                        cb(null, info.data);
                    }
                })
            },
            user: function(cb) {
                api = new WechatAPI(config.APPID, config.APPSECRET);
                api.getUser(userAccount, function(error, userInfo) {
                    // console.log(error + ' |  ' + userInfo)
                    cb(null, userInfo);
                });
            }
        }, function(error, result) {
            console.log(result)

            res.render('schedule', result);
        })
    },
    //修改题目状态
    changeActionStatus: function(req, res) {
        var taskNo = req.query.taskNo;
        var userAccount = req.query.userAccount;
        var projectUniqNo = req.query.projectUniqNo;
        var scheduleCount = req.query.scheduleCount;
        // http://123.56.126.231:8080/info/task/userCommitTask?taskNo='+taskNo+'&userAccount='+userAccount
        request.get(config.server + '/info/task/userCommitTask?taskNo=' + taskNo + '&userAccount=' + userAccount, function(error, response, info) {
            if (error) res.json({ error: error });
            if (!error && response.statusCode == 200) {
                console.log(info);
                res.redirect('/schedule?userAccount=' + userAccount + '&projectUniqNo=' + projectUniqNo + '&scheduleCount=' + scheduleCount)
            }
        })
    },
    //创建project页面
    createProject: function(req, res) {
        res.render('createProject');
    },
    getActionList: function(req, res) {
        request.get(config.server + '/admin/action/list', function(error, response, info) {
            if (error) res.json({ error: error });
            if (!error && response.statusCode == 200) {
                info = JSON.parse(info);
                console.log(info);
                res.json(info.data);
            }
        })
    },
    //点击个人主页后进行的校验
    getUserinfo: function(req, res) {
        console.log('code', req.query.code);
        async.waterfall([
            function(cb) {
                client.getAccessToken(req.query.code, function(err, result) {
                    var accessToken = result.data.access_token;
                    var openid = result.data.openid;
                    console.log('openid', openid);
                    return cb(null, openid);
                });
            },
            function(openid, cb) {
                client.getUser(openid, function(err, userInfo) {
                    return cb(err, userInfo);
                });
            },
            function(userInfo, cb) {
                var url = config.server + "/user/showUserDetail?account=" + userInfo.openid + "&nickName=" + userInfo.nickname;
                console.log(url)
                request.get(url, function(err, response, body) {
                    if (!err && response.statusCode == 200) {
                        var userinfo = {
                            projectData: JSON.parse(body).data,
                            userInfo: userInfo
                        };
                        return cb(null, userinfo);
                    }
                    return cd(err, null);
                })
            }
        ], function(err, result) {
            console.log(err, result)
            if (result.projectData.status === 1) {
                //创建完没选projec
                console.log('跳转倒选择projec');
                var userInfo = result.userInfo;
                var projectData = result.projectData;
                request.get(config.server + '/admin/project/list', function(error, response, data) {
                    if (!error && response.statusCode == 200) {
                        data = JSON.parse(data);
                        // console.log(data.data);
                        return res.render('userinfo', {
                            account: userInfo.openid,
                            nickName: userInfo.nickname,
                            sex: userInfo.sex,
                            level: 10,
                            profileUrl: userInfo.headimgurl,
                            projectUniqNo: projectData.projectUniqNo,
                            projectName: projectData.projectName,
                            progressRate: null,
                            projectList: data.data,
                            userAllTaskList:[],
                            isCancel:false
                        });
                    }
                });

            } else if (result.projectData.status === 3) {
                //当前是个新用户要先创建再选择
                return res.redirect('/registWechatUser?account=' + result.userInfo.openid +
                    '&nickName=' + result.userInfo.nickname +
                    '&sex=' + result.userInfo.sex +
                    '&profileUrl=' + result.userInfo.headimgurl)
            } else {
                //已经选择project
                console.log('已经选择project');
                var userInfo = result.userInfo;
                var projectData = result.projectData;
                console.log(projectData);
                var url = config.server + "/info/task/userAllTaskList?projectUniqNo=" + projectData.userProjectDetail.projectUniqNo + "&userAccount=" + userInfo.openid;
                    console.log(url);
                    return request(url, function(error, response, result) {
                        if (!error && response.statusCode == 200) {
                            result = JSON.parse(result);
                            // return res.json({ 'userAllTaskList': result.data.listCount });
                            return res.render('userinfo', {
                                    account: userInfo.openid,
                                    nickName: userInfo.nickname,
                                    sex: userInfo.sex,
                                    level: 10,
                                    profileUrl: userInfo.headimgurl,
                                    projectUniqNo: projectData.userProjectDetail.projectUniqNo,
                                    projectName: projectData.userProjectDetail.projectName,
                                    progressRate: projectData.userProjectDetail.progressRate,
                                    projectList: [],
                                    userAllTaskList: result.data.listCount,
                                    isCancel: true
                                });
                        }
                    })
            }
        });
    },
    //跳转个人主页界面
    showUserinfo: function(req, res) {
        request.get(config.server + '/admin/project/list', function(error, response, data) {
            if (!error && response.statusCode == 200) {
                data = JSON.parse(data);
                console.log(data.data);
                return res.render('userinfo', {
                    account: 'oewo7wMrPRdkfCxLhkQ0qTTMyRME',
                    nickName: 'qiushi',
                    sex: 1,
                    level: 10,
                    profileUrl: 'http://wx.qlogo.cn/mmopen/UAMuw0RfSYw9nDMRAB5owuPmyD9YmsuNYORtiaoIj1jRQWPK9mddibwRZUreR5KkS3JNn883SKQ1AVg4ueZf5ibVDicic3DJSj9Lb/0',
                    projectUniqNo: null,
                    projectName: '',
                    progressRate: null,
                    projectList: data.data,
                    userAllTaskList:[],
                    isCancel: false
                });
            }
        });
    },

    //用户注册
    registWechatUser: function(req, res) {
        var account = req.query.account,
            nickName = req.query.nickName,
            realName = req.query.realName || '',
            phoneNum = req.query.phoneNum || '',
            sex = req.query.sex || 2,
            level = req.query.level || 0,
            type = req.query.type || 'weChat',
            profileUrl = req.query.profileUrl || '';

        request.get(config.server + '/user/createUser?account=' + account +
            '&nickName=' + nickName + '&realName=' + realName +
            '&phoneNum=' + phoneNum + '&sex=' + sex + '&type=1&profileUrl=' + profileUrl +
            '&level=' + level, function(err, response, data) {
                if (!err && response.statusCode == 200) {
                    res.render('userinfo', {
                        account: account,
                        nickName: nickName,
                        sex: sex,
                        level: level,
                        profileUrl: profileUrl,
                        projectUniqNo: null,
                        projectName: null,
                        progressRate: null
                    });
                }
            });

    },
    aboutUs: function(req,res){
        res.render('aboutus')
    },

    //修改微信公众账号的菜单栏
    updateWeixinMenu: function(req, res) {
        var url = client.getAuthorizeURL('http://www.cpzero.cn/userinfo', 'STATE', 'snsapi_userinfo');
        var aboutusUrl = client.getAuthorizeURL('http://www.cpzero.cn/aboutUs', 'STATE', 'snsapi_userinfo');
        // var url = client.getAuthorizeURL('http://gxqxv89xs6.proxy.qqbrowser.cc/userinfo', 'STATE', 'snsapi_userinfo');
        // var aboutusUrl = client.getAuthorizeURL('http://gxqxv89xs6.proxy.qqbrowser.cc/aboutUs', 'STATE', 'snsapi_userinfo');
        console.log(url)
        api = new WechatAPI(config.APPID, config.APPSECRET);
        api.removeMenu(function(err, result) {
            if (result) {
                var menu = {
                    "button": [
                        {
                            "type": "view",
                            "name": "Home Page",
                            "url": url
                        },
                        {
                            "type": "click",
                            "name": "Current Tasks",
                            "key": "CREAT_TASK_1"
                        },
                        {
                            "type":'view',
                            "name": "Contact us",
                            "url": aboutusUrl
                        }

                    ]
                };
                api.createMenu(menu, function(err, result) {
                    if (err) return console.log(err);
                    return res.send(result);
                });
            }
        });
    }

}