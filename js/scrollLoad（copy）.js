/**
 * Created by Administrator on 2016/8/23.
 */
$(function(){

});

function scrollLoad(){
    var scroll = true;
    var pageNum = '',conH = 0,allScl = 0,gH = 0,len = 0,ch = 0;
    ajaxData.pageIndexName = parseInt(ajaxData.pageIndexName);

    this.start = function(node){

    };

    document.getElementsByClassName('card_box')[0].addEventListener('scroll',function(){
        pageNum = parseInt(data.number / 20 + 1);
        conH = $('.swiper-wrapper').height();
        allScl = $($('.card_box')[0]).scrollTop();
        gH = $(".ghost").height();

        console.log(conH+","+allScl);
        if(conH<=(allScl + 100)){
            console.log('bottom');
        }

        if(allScl > gH * 1.5 && $('.returnTop').css('display') == 'none' ){
            $('.returnTop').fadeToggle();
        }else if(allScl < gH * 1.5 && $('.returnTop').css('display') == 'block'){
            $('.returnTop').toggle();
        }

        if(conH<=(allScl + gH + 100) && scroll == true && ajaxData.pageIndexName <= pageNum - 1){
            scroll = false;
            ajaxData.pageIndexName++;
            var add = Ajax(getUrl,'GET',ajaxData).responseText;
            add = JSON.parse(add);
            addData(add,data,transData);

            setTimeout(function(){
                scroll = true;
            },500);
        }
    })
}