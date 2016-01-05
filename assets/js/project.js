$(function () {
    $('.addAction').click(function () {
        $('.addAction').before('<div class="panel panel-default">' +
            '<div class="panel-body actions">' +
            '<div class="row"><p class="col-md-4">输入活动点：</p><input class="col-md-4 timePoint"></div>' +
            '<div class="row"><button class="btn btn-success btn_add_action col-offset-md-2 col-md-4">添加action</button><button class="btn btn-warning btn_delete_action  col-offset-md-2 col-md-4">删除action</button></div>' +
            '</div></div>');
            
        
        // $('.btn_add_action').click(function () {
        //     console.log('~')
        //     var _self = this;
        //     var html = '';
        //     console.log(_self)
        //     $.get('/getActionList', function (actions) {
        //         html += '<div class="row"><p class="col-md-4">选择一个action：</p><select class="form-control-my" >';
        //         for (var i in actions) {
        //             html += '<option class="col-md-4" vaule="' + actions[i].actionNo + '">' + actions[i].actionName + '</option>';
        //         }
        //         html += '</select></div>';
        //         console.log(html)
        //         $(_self).before(html)
        //         html ='';
        //     })
        // });


    });

    $('.btn_submit_project').click(function () {
        var projectName = $('#projectName').val();
        var projectDesc = $('#projectDesc').val();
        var scheduleTimeLevel = '';
        var actionList = [];
        var radio = $(':radio');
        for (var i = 0; i < radio.length; i++) {
            if (radio[i].checked) {
                scheduleTimeLevel = $(radio[i]).val();
            }
        }
        var panelNum = $('.panel .panel-default');
        for (var i = 0; i < panelNum.length; i++) {
            // console.log(panelNum[i])
            var panelChild = $(panelNum[i]).children();
            console.log('timePoint', $($(panelChild[0]).children()[0]).children('.timePoint').val());
            var num = $($(panelChild[0]).children()[1]).children('.row').length;
            for (var j = 0; j < num; j++) {
                var row = $($(panelChild[0]).children()[1]).children('.row')[j];
                // console.log(actionNo, $(row).children('select').find("option:selected").val());
                console.log('timePoint', $($(panelChild[0]).children()[0]).children('.timePoint').val());
                console.log('actionNo', $(row).children('select').val());
                var point = {
                    "timePoint": $($(panelChild[0]).children()[0]).children('.timePoint').val(),
                    "actionNo": $(row).children('select').val()
                }
                actionList.push(point);

            }
        }
        // function GetJsonData(projectName, projectDesc, scheduleTimeLevel, actionList) {
        //     var json = {
        //         "projectName": projectName,
        //         "projectDesc": projectDesc,
        //         "scheduleTimeLevel": scheduleTimeLevel,
        //         "actionList": actionList
        //     }
        //     return json;
        // }


        // $.ajax({
        //     type: "POST",
        //     url: "/insertProject",
        //     data: JSON.stringify(GetJsonData(projectName, projectDesc, scheduleTimeLevel, actionList)),
        //     contentType: "application/json; charset=utf-8",
        //     dataType: "json",
        //     success: function (msg) {
        //         alert("Data Saved: " + msg);
        //     }
        // });

        var json = {
            "projectName": projectName,
            "projectDesc": projectDesc,
            "scheduleTimeLevel": scheduleTimeLevel,
            "actionList": actionList

        };
        var data = JSON.stringify(json);
        console.log(data);
        $.post('/insertProject', { data: data }, function (e) {  
            self.location = '/project';
        })
        



    });

    //绑定到还为生成的node节点上 见jquery delegate
    $('#questions').delegate('.btn_add_action', 'click', function () {
        var _self = this;
        var html = '';
        console.log(_self)
        $.get('/getActionList', function (actions) {
            html += '<div class="row"><p class="col-md-4">选择一个action：</p><select class="form-control-my" >';
            for (var i in actions) {
                html += '<option class="col-md-4" value="' + actions[i].actionNo + '">' + actions[i].actionName + '</option>';
            }
            html += '</select></div>';
            $(_self).before(html)
        })
    });
    $('#questions').delegate('.btn_delete_action', 'click', function () {

        var parent = $(this).parent();
        var length = parent[0].childNodes.length;
        console.log(length);
        parent[0].childNodes[length - 4].remove();

    })

})
