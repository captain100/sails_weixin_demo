/**
 * Created by qiushi on 15/10/25.
 */
$(function () {
    $('.showQues').click(function () {
        var data_paper = $(this).attr('data-paperId');
        console.log(data_paper);
        //var url = '/getQuestion?paperId='+data_paper;

        $.get('/getQuestion',{paperId:data_paper},function(e){
            console.log(e);
        });
    });
});