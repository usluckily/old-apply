var testUrl = './testJson/data.json';
var getUrl = './testJson/data.json';//'/school/repairManage_listRepair.do?method=getRepairList'
var auth;
var firstLoad = true;
var permission = '';
var getBasic = '/school/applyforManage_listApplyfor.do?method=getApplyforBasicDataMobileV22',
    getList = '/school/applyforManage_listApplyfor.do?method=getApplyforListMobileV22',
    getNum = '/school/applyforManage_listApplyfor.do?method=getApplyforCountMobileV22',
    getApplyForCount = '/school/applyforManage_listApplyfor.do?method=getApplyforCountMobileV22';//获取各状态数量
var ajaxData = {sid:'',userid:'',roleid:'',pageIndexName:'1',status:'1'};


var listObj = {number:'',data:''};
var statusNum = {data:''};
var data = {data:'',placetypedata:'',placedata:'',number:''};
var sliderData = {data:''};

var configObj = {
    placetypeid:'-1',
    statusid:'1'
};

if(window.GreenSchool){
    GreenSchool.showLeftBtn(false);
    ajaxData.userid = GreenSchool.getUserID();
    ajaxData.sid = GreenSchool.getSchoolId();
    ajaxData.roleid = GreenSchool.getRoleId();
    permission = GreenSchool.getPermissions('WPSQ');
    alert(permission);
}


function Ajax(url,type,data){
//    alert(JSON.stringify(data));
    var Info = $.ajax({
        url:url,
        type:type ? type : 'GET',
        data:data,
        async:false,
        timeout:10000,
        beforeSend:function(){
            $('.layout').css({'display':'table'});
        },
        success:function(){
            setTimeout(function(){
                $('.layout').css({'display':'none'});
            },500);
        },
        error:function(e){
            setTimeout(function(){
                $('.layout').css({'display':'none'});
            },500);
            alert("ERR:"+JSON.stringify(e));
        }
    });
//    alert(JSON.stringify(Info));
    return Info;
}

function getData(url,ajaxType,ajaxdata,transData,replace){
    var Info = Ajax(url,ajaxType,ajaxdata).responseText;
    if(typeof Info == "string"){
        try{
            Info = JSON.parse(Info);
//            Info = eval('('+Info+')');
        }catch(e){throw e;}
    }

    for(var i in Info){
        if(Info[i] instanceof Array){
            for(var j in Info[i]){
                Info[i][j] = transDataFunc(Info[i][j],transData);
            }
        }
    }

//    alert(JSON.stringify(Info));
    replaceData(Info,replace);
}//

function addData(add,oldData,transData){
    for(var i in add.data){
        add.data[i] = transDataFunc(add.data[i],transData);
    }
    oldData.data = oldData.data.concat(add.data);
}

function transDataFunc(Info,transData){
    if(transData){//transData用数组传进来
        for(var i in transData){
          var Str = toUtf16( Info[ transData[i] ] );
          Info[ transData[i] ] = Str;
        }

//        for(var i = 0 ,len = Info.data.length;i<len;i++){
//            for(var j in Info.data[i]){
//                var Str = toUtf16( Info.data[i][j] );
//                Info.data[i][j] = Str;
//            }
//        }
//        alert(JSON.stringify(Info));
        return Info;
    }
}//transData

function replaceData(newData,oldData){
    for(var i in newData){
        oldData[i] = newData[i];
    }

}//新旧data属性替换

function calendarConfirm(){
    setTimeout(function(){
        search();
    },100);

}//在calendar源码中新增了这个函数的绑定

function nodeSize(){
    var iconW = $('.icon-box').width() ,iconBW = $('.icon-box-big').width() ;
    var navW = $('.nav>ul').width() , navLiLen = $('.nav>ul>li').length;
    $('.nav>ul>li').width(100 / navLiLen+"%");
    $(".icon-box").css({"height":iconW,"lineHeight":iconW+"px","fontSize":iconW/2+"px"});
    $(".icon-box-big").css({"height":iconBW,"lineHeight":iconBW+"px","fontSize":iconBW/2+"px"});
}
nodeSize();

var golbal = new Vue({
    el:"#myapp",
    data:{
        data:data,
        basic:basicObj,
        list:listObj,
        status:statusNum,
        con:configObj,
        slide:sliderData,
        scrollTopShow:''
    },
    methods:{
        jump: function(url,i){
            i = JSON.stringify(i);
//            $('.right-layer').animate({'right':'0'});
            location.href = url+'?'+i;
        }
    },
    computed:{
        scrollTopShow: function(){

        }
    }
});


//function jump(a){
//    /*页面跳转传值*/
////    var index = $(a).index();
////    var jumpData = data.data[index];//取对应index的数组数据
////    jumpData = JSON.stringify(jumpData);
////    var url = 'apply.html?data=';
////    url += jumpData;
////    location.href = url;
//    /*页面跳转传值*/
//
//    /*当前页*/
//    $('.right-layer').animate({'right':'0'});
//    /*当前页*/
//}

function getPageW(){
    var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return w;
}

function navScroll(){
    var w = getPageW();
    var limit = 40;
    var node = '';
    var speed = 300;
    if(document.getElementById('scr_nav') != undefined){
        node = document.getElementById('scr_nav');
    }else{
        return;
    }
    var navW = $(node).width();

    var obj = {
        X:0,
        NX:0,
        move:false
    };

    this.start = function(){
        alert('2');
        node.addEventListener('touchstart',function(e){
            if( w < 500 ){
                obj.move = true;
                obj.X = e.pageX || e.changedTouches[0].pageX;
                var left = $(node).css('left');
                obj.X -= parseInt(left);
            }
        });

        node.addEventListener('touchmove',function(e){
            if(obj.move == true){
                obj.NX = e.pageX || e.changedTouches[0].pageX;
                if(obj.NX - obj.X < limit && obj.NX - obj.X > (-navW/2 - limit)){
                    $(node).css({'left':obj.NX - obj.X })
                }else{

                }
            }
        });

        node.addEventListener('touchend',function(){
            if(obj.NX - obj.X > limit){
                $(node).animate({'left':0 })
            }else if(obj.NX - obj.X < (-navW/2 - limit)){
                $(node).animate({'left':-navW/2 })
            }
            obj.move = false;
        });
    };

    this.oneTimeMove = function(dir){
        var w = $(node).width(),
            cw = $(node).find('li').width(),
            left = parseInt($(node).css('left')),
            index = $(node).find('.on').index();

        switch(dir){
            case '1':
                left <= 0 && left > -w/2 ? $(node).animate({'left':-cw + left},speed) : '';
                $(node).find('li').removeClass('on').eq(index + 1).addClass('on');
                break;
            case '-1':
                console.log(left+",,"+-w/2);
                left + 5 >= -w/2 && left <= -5 ? $(node).animate({'left':left + cw},speed) : '';
                $(node).find('li').removeClass('on').eq(index - 1).addClass('on');
                break;
        }
    }
}
var NS = new navScroll();


$(window).resize(function(){
    nodeSize();
});

function search(){
//    var sid = ajaxData.sid,status = ajaxData.status,placetypeid = ajaxData.placetypeid,placeid = ajaxData.placeid,priority = ajaxData.priority;
    ajaxData.repairdate = $('#startDate').val();

    ajaxData.placetypeid = $('#placetypeid').attr('data-postid');
    if(ajaxData.placetypeid == 14){
        ajaxData.classid = $('#placeid').attr('data-postid');
        delete ajaxData.placeid;
    }else{
        ajaxData.placeid = $('#placeid').attr('data-postid');
        delete ajaxData.classid;
    }
    ajaxData.priority = $('#priority').attr('data-postid');
    ajaxData.pageIndexName = 1;

    getData(getUrl,'GET',ajaxData,transData);
}
//

function setNum(node){
    var parent = $(node);
    var child = $('<span></span>');
    child.text("("+data.number+")" );
    parent.append(child);
}

//
$(function(){
    $('.select').click(function(){
        $(this).siblings('.select_box').fadeToggle();
    });

    $(document).on('click','.select_box>li',function(){
        var parent = $(this).parent();
        var text = $(this).text();
        var postId = $(this).attr('data-id');
        $(parent).fadeToggle();
        $(parent).siblings('.select').text(text);
        $(parent).siblings('.select').attr('data-postid',postId);

        ///
    });

    $(document).on('click','#placeType>li',function(){
        configObj.placetypeid=$(this).attr('data-id');
        var allPlace = $('#place>li').eq(0);
        var sib = $('#place').siblings('.select');
        sib.text( $(allPlace).text() );
        sib.attr('data-postId',allPlace.attr('data-id'));

        search();
    });

    $(document).on('click','#pri>li',function(){
        search();
    });

    $(document).on('click','#place>li',function(){
        search();
    });

});

function nodeInit(){
    this.card = function(){
        var htmlH = $('.all').height();
        var headH = $('.head').height();
        $('.card_box').height(htmlH - headH);
        console.log("all:"+htmlH+",head:"+headH);
    };
    this.calendar = function(){
        var currYear = (new Date()).getFullYear();
        var opt={};
        opt.date = {preset : 'date'};
        opt.datetime = {preset : 'datetime'};
        opt.time = {preset : 'time'};
        opt.default = {
            theme: 'android-ics light', //皮肤样式
            display: 'modal', //显示方式
            mode: 'scroller', //日期选择模式
            dateFormat: 'yyyy/mm',
            lang: 'zh',
            showNow: true,
            nowText: "今天",
            startYear: currYear-5, //开始年份
            endYear: currYear+5//结束年份
        };
        $("#startDate").mobiscroll($.extend(opt['date'], opt['default']));
//        $("#endDate").mobiscroll($.extend(opt['date'], opt['default']));

//        $("#startDate").mobiscroll().date({
//            theme: "android-ics light",
//            lang: "zh",
//            cancelText: null,
//            dateFormat: 'yy/mm', //返回结果格式化为年月格式
//            // wheels:[], 设置此属性可以只显示年月，此处演示，就用下面的onBeforeShow方法,另外也可以用treelist去实现
//            onBeforeShow: function (inst) { inst.settings.wheels[0].length>2?inst.settings.wheels[0].pop():null; }, //弹掉“日”滚轮
//            headerText: function (valueText) { //自定义弹出框头部格式
//                array = valueText.split('/');
//                return array[0] + "年" + array[1] + "月";
//            }
//        });
}
}


//popup
$('.popup').on('touchstart','.popup_con>li,.popup_exit',function(){
    $(this).css({'background':'#ececec'})
});
$('.popup').on('touchend','.popup_con>li,.popup_exit',function(){
    $(this).css({'background':'#fff'})
});
