/**
 * Created by qiushi on 15/10/25.
 */
$(function() {
    $('.sub_btn').click(function(){
        var scheduleCount = $(this).attr('data-scheduleCount')
        var paperId = $('#paperId').val();
        var userAccount = $('#userAccount').val();
        var taskNo = $('#taskNo').val();
        var answers =[];
        for(var i = 0;i<$('.radio_wrap').length;i++){
            var id = $('.radio_wrap')[i].getAttribute('data-questionid');
            var value = $('input:radio[name='+id+']:checked').val();
            var location = $('input:radio[name='+id+']:checked').attr('data-location');
            var answer = {
                "location": location,
                "questionId": id,
                "value": value,
            };
            answers.push(answer);
        }
        var data = {
            'userAccount':userAccount,
            'taskNo':taskNo,
            'paperId':paperId,
            'answers':answers
        };
        var flag = confirm('Are you sure');
        if(flag){
            $.ajax({
                url: '/subPaper',
                type: 'post',
                data:data,
                dataType: "json",
                success: function(e){
                    return window.location.href='http://www.cpzero.cn/schedule?userAccount='+e.info.data.userAccount+'&projectUniqNo='+e.info.data.projectUniqNo+'&scheduleCount='+scheduleCount;
                },
                error: function(e){
                    return window.location.href='http://www.cpzero.cn/schedule?userAccount='+e.info.data.userAccount+'&projectUniqNo='+e.info.data.projectUniqNo+'&scheduleCount='+scheduleCount;
                }
            })            
        }})
})
