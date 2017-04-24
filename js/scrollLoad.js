/**
 * Created by Administrator on 2016/8/23.
 */
function scrollLoad(){
    var scroll = true;
    var pageNum = '',conH = 0,allScl = 0,gH = 0,len = 0,ch = 0;
    ajaxData.pageIndexName = parseInt(ajaxData.pageIndexName);

    this.start = function(node){
        node.on('scroll',function(){
            len = $(this).find('.card').length;
            pageNum = parseInt(data.total / 20 + 1);
            conH = $(this).find('.in_card_box').height();
            allScl = $(this).scrollTop();
            gH = $(this).height();

            console.log(conH);

            if(conH<=(allScl + gH + 5)){
//                alert(conH+","+ (allScl + gH + 5) );
//                alert('bottom');
            }

//            if(allScl > gH * 1.5 && $('.returnTop').css('display') == 'none' ){
//                $('.returnTop').fadeToggle();
//            }else if(allScl < gH * 1.5 && $('.returnTop').css('display') == 'block'){
//                $('.returnTop').toggle();
//            }

            if(conH<=(allScl + gH + 5) && scroll == true && ajaxData.pageIndexName <= pageNum - 1){
                scroll = false;
                ajaxData.pageIndexName++;
                Ajax(getList,'GET',ajaxData,function(d){
                    var add = JSON.parse(d);
                    addData(add,data,transData);
                });

                setTimeout(function(){
                    scroll = true;
                },500);
            }
        })
    };
}
var scrollLoad = new scrollLoad();
//var node = document.getElementsByClassName('card_box')[1];
//node.scrollLoad = true;
//console.log(node.scrollLoad);
//scrollLoad.start(node);