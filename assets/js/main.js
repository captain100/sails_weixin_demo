$(function () {
    $(".addQuestion").click(function () {
        $(".addQuestion").before('<div class="panel panel-default">' +

            '<div class="panel-body question">' +
            '<input class="type" type="hidden" value="1">' +
            '<input class="col-md-12 quesDetail" type="text" value="问题详情">' +
            '<input class="col-md-7 option" value="选项"><input class="col-md-5 score" value="评分">' +
            '<input class="col-md-7 option" value="选项"><input class="col-md-5 score" value="评分">' +
            '<input class="btn btn_add_option" value="+"><input class="btn btn_delete_option" value="-">'+
            '</div></div>');
        $('.btn_add_option').click(function(){
            $(this).before('<input class="col-md-7 option" value="选项"><input class="col-md-5 score" value="评分">');
        });
        $('.btn_delete_option').click(function(){
            var parent = $(this).parent();
            var length = parent[0].childNodes.length;
            parent[0].childNodes[length-3].remove();
            parent[0].childNodes[length-4].remove();
        });

    });

    $('.addDescription').click(function () {
        $(".addQuestion").before('<div class="panel panel-default" >' +
            '<div class="panel-body question">' +
            '<input class="type" type="hidden" value="2">' +
            '<textarea class="col-md-12 quesDetail" cols="2"  >题目描述</textarea>' +
            '</div></div>')
    });

    $('.btn_submit').click(function () {
        var title = $('#inputQuetitle').val();
        var detailed = $('#inputQueDet').val();
        var questionList = [];
        $('.question').each(function () {
            var type = $(this).children('.type').val();
            console.log('type =  '+type);
            if(type === '1'){
                var quesDetail = $(this).children('.quesDetail').val();
                var node =$(this).children('input');
                var nodeNum = node.length;
                var options = [];
                for(var i =2;i<nodeNum-2;){
                    var option ={
                        'text':node[i].value,
                        'value':node[i+1].value
                    };
                    options.push(option);
                    i = i+2;
                }
                var question = {
                    "title": quesDetail,
                    "type": type,
                    "option": options
                };
                questionList.push(question);
            }else{
                var quesDetail = $(this).children('.quesDetail').val();
                var question = {
                    "title": quesDetail,
                    "type": type
                };
                questionList.push(question);

            }


        });
        //
        var json = {
            "paperTitle": title,
            "desc": detailed,
            "questionList":questionList

        };
        var data = JSON.stringify(json);
        console.log(data);
        $.post('/insert',{data:data},function(e){console.log(e)}).done(function(){
            alert('试卷插入成功！！！');
            self.location = '/list';
        })
    })


});

