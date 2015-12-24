/**
 * Created by qiushi on 15/11/1.
 */
$(function(){
    $(".shijian").click(function(){
        var collpase = $(this).attr('data-href');
        //alert(collpase);
        $(collpase).collapse('toggle');
    })
    // $('.updateType').click(function(){

    // 	var taskNo = $(this).attr('data-taskNo'),
    // 	userAccount = $(this).attr('data-userAccount');

    // 	$.get('http://123.56.126.231:8080/info/task/userCommitTask?taskNo='+taskNo+'&userAccount='+userAccount,function(data){

    // 	})
        
    // })
});