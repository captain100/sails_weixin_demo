var config = require('sails').config;
var request = require('request');
module.exports = {
    'insertProject': function (req, res) {
        var data = JSON.parse(req.body.data);
        console.log(data);
        var options = {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36'
            },
            url: config.server + '/admin/project/create',//http://123.56.227.132:8080/admin/paper/create
            method: 'POST',
            json: true,
            body: data
        };
        request(options, function (error, response, data) {
            if (!error && response.statusCode == 200) {
                console.log('----info------', data);
                res.json('ok');
            }
        });
    },
    'getProjectNo': function (req, res) {
        var projectNo = req.query.projectNo;
        request({url:config.server+'/admin/project/projectDetail?projectNo='+projectNo},function(error,response ,body){
            if(!error&&response.statusCode ==200){
                body = JSON.parse(body);
                // res.json(body);
                res.render('editProject',body.data);
            }
        })
    }
}