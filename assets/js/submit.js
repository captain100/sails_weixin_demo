/**
 * Created by qiushi on 15/10/25.
 */
$(function() {
    $('.sub_btn').click(function(){
        var paperId = $('#paperId').val();
        var userAccount = $('#userAccount').val();
        var taskNo = $('#taskNo').val();
        var answers =[];
        for(var i = 0;i<$('.radio_wrap').length;i++){
            var id = $('.radio_wrap')[i].getAttribute('data-questionid');
            var value = $('input:radio[name='+id+']:checked').val();
            var location = $('input:radio[name='+id+']:checked').attr('data-location');
            var answer ={
                "questionId": id,
                "value": value,
                "location": location

            };
            answers.push(answer);
        }
        var data = {
            'userAccount':userAccount,
            'taskNo':taskNo,
            'paperId':paperId,
            'answers':answers
        };
        var flag = confirm('确认是否提交？');
        console.log(flag);
        if(flag){
            $.get('/subPaper',{data:data},function(e){
            // if(e){
                
                
            // }
            // console.log(e.info.data.userAccount);
            window.location.href='http://www.cpzero.cn/schedule?userAccount='+e.info.data.userAccount+'&projectUniqNo='+e.info.data.projectUniqNo+'&scheduleCount=1';

        })
        }
        

    });
});