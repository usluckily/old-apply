var testUrl = './testJson/data.json';
var getUrl = './testJson/data.json';//'/school/repairManage_listRepair.do?method=getRepairList'
var auth;
var permission = 'SZWPGLY,CKSYWPSQ,WPFB,WPXG,WPQX,WPTG,WPYJC,WPBH,WPYGH,WPKLQ,WPGH,WPCXQX,WPCXBH';
var parentParam;
var firstLoad = true;
var getBasic = '/school/applyforManage_listApplyfor.do?method=getApplyforBasicDataMobileV22',
    getList = '/school/applyforManage_listApplyfor.do?method=getApplyforListMobileV22',
    getNum = '/school/applyforManage_listApplyfor.do?method=getApplyforCountMobileV22',
    getApplyForCount = '/school/applyforManage_listApplyfor.do?method=getApplyforCountMobileV22',//获取各状态数量
    updateApply = '/school/applyforManage_updateApplyfor.do?method=updateApplyforMobileV22',
    addApply = '/school/applyforManage_addApplyfor.do?method=addApplyforMobileV22',
    approveApply = '/school/applyforManage_updateApplyfor.do?method=approveApplyforMobileV22',
    isExist = '/school/inventoryManage_listInventory.do?method=ajaxGetInventoryQuantityByEquipmentid';

var ajaxData = {sid:'31',userid:'590544730',roleid:'205,201',pageIndexName:'1',status:'1',showAll:'',setApplyforServiceman:''};

var listObj = {number:'',data:''};
var basicObj = {equipmentdata:'',equipmenttypedata:'',placetypedata:'',placedata:'',classtabledata:'',departmentdata:'',status:'',applyNumber:1};
var statusNum = {data:''};
var statusObj = [
    {name:'待审批',id:'1'},
    {name:'已审批',id:'2'},
    {name:'可领取',id:'3'},
    {name:'已借出',id:'4'},
    {name:'待归还',id:'5'},
    {name:'已归还',id:'6'},
    {name:'已取消',id:'7'},
    {name:'已驳回',id:'8'}
];
var data = {data:'',placetypedata:'',placedata:'',number:'',total:''};
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
//    alert(permission);
    permission = permission.split(',');
    isInArr('CKSYWPSQ',permission) ? ajaxData.showAll = '1' : ajaxData.showAll = '0';
    isInArr('SZWPGLY',permission) ? ajaxData.setApplyforServiceman = '1' : ajaxData.setApplyforServiceman = '0';
}


function Ajax(url,type,data,callback){
//    alert(JSON.stringify(data));
    var Info = $.ajax({
        url:url,
        type:type ? type : 'GET',
        data:data,
        async:true,
        timeout:10000,
        beforeSend:function(){
            $('.layout').css({'display':''});
        },
        success:function(d){
            if(callback){
                callback(d);
            }
//            alert(JSON.stringify(d));
            setTimeout(function(){
                $('.layout').css({'display':'none'});
            },500);
        },
        error:function(e){
            setTimeout(function(){
                $('.layout').css({'display':'none'});
            },500);
//            alert("ERR:"+JSON.stringify(e));
        }
    });
//    alert(JSON.stringify(Info));
    return Info;
}

function getData(url,ajaxType,ajaxdata,transData,replace){
    var callback = function(Info){
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

//        alert(JSON.stringify(Info));
        replace ? replaceData(Info,replace) : '';
    };

    Ajax(url,ajaxType,ajaxdata,callback);
}//

function subData(type,urlobj){
    var sid = ajaxData.sid , userid = ajaxData.userid , auth = ajaxData.auth , applyforclassid = $('#class').attr('data-id') , dempid = $('#dept').attr('data-id') , equipmenttypeid = $('#eqType').attr('data-id') ,
        equipmentid = $('#eq').attr('data-id') , otherequipment = $('#otherEq').val() , equipmentnum = $('#applyNum').text() , applyforreason = $('#applyReason').val() , pagegettime = $('#startDate').val() ,
        pagereturntime = $('#endDate').val() , isexistinventory = $('.radio_box').attr('data-status') , postil = $('#postil').val();
    switch(type){
        case 'apply':
            var apply = {
                sid:sid,
                userid:ajaxData.userid,
                auth:auth,
                applyforclassid:applyforclassid,
                dempid:dempid,
                equipmenttypeid:equipmenttypeid,
                equipmentid:equipmentid,
                otherequipment:otherequipment,
                equipmentnum:equipmentnum,
                applyforreason:applyforreason,
                pagegettime:pagegettime,
                pagereturntime:pagereturntime,
                isexistinventory:isexistinventory
            };
//            alert(JSON.stringify(postData));
//            if($('#class').val() == '' && $('#dept').val() == ''){
//                alert('班级或部门不能为空');
//            }
            if($('#eq').val() == '' && $('#otherEq').val() == ''){
                alert('物品未填写');
            }else if($('#endDate').val() == ''){
                alert('归还日期未填写');
            }else{
                Ajax(addApply,'POST',apply,function(d){
                    history.back();
                    parent.applyCallParent();
                });
            }
            break;
        case 'reject':
            var reject = {
                sid:sid,
                userid:userid,
                auth:auth,
                applyforid:urlobj.data.applyforid,
                servicemanid:$('#serviceMan').attr('data-id'),
                comment:postil,
                status:urlobj.data.statuId,
                isapprove:0
            };
//            alert(urlobj.data.statuId);
            Ajax(approveApply,'POST',reject,function(d){
                history.back();
                parent.changeCallParent();
            });
            break;
        case 'cancel':
            var reject = {
                sid:sid,
                userid:userid,
                auth:auth,
                applyforid:urlobj.data.applyforid,
                servicemanid:$('#serviceMan').attr('data-id'),
                comment:postil,
                status:urlobj.data.statuId,
                isapprove:2
            };
            Ajax(approveApply,'POST',reject,function(d){
                history.back();
                parent.changeCallParent();
            });
            break;
        case 'pass':
            var pass = {
                sid:sid,
                userid:userid,
                auth:auth,
                applyforid:urlobj.data.applyforid,
                servicemanid:$('#serviceMan').attr('data-id'),
                comment:postil,
                status:urlobj.data.statuId,
                isapprove:1
            };
            Ajax(approveApply,'POST',pass,function(d){
                history.back();
                parent.changeCallParent();
            });
            break;
        case 'update':
            var update = {
                sid:sid,
                userid:userid,
                auth:auth,
                applyforid:urlobj.data.applyforid,
                status:$('#status').attr('data-id'),
                servicemanid:$('#serviceMan').attr('data-id')
            };
            Ajax(updateApply,'POST',update,function(d){
                history.back();
                parent.changeCallParent();
            });
            break;
        case 'updateApply':
            var search = location.search.split('?')[1];
            console.log(search);
            search = JSON.parse(decodeURI(search));
            var update = {
                sid:sid,
                userid:ajaxData.userid,
                auth:auth,
                applyforclassid:userid,
                dempid:dempid,
                equipmenttypeid:equipmenttypeid,
                equipmentid:equipmentid || '',
                otherequipment:otherequipment,
                equipmentnum:equipmentnum,
                applyforreason:applyforreason,
                pagegettime:pagegettime,
                pagereturntime:pagereturntime,
                isexistinventory:isexistinventory,
                applyforid:search.applyforid
            };
            Ajax(updateApply,'POST',update,function(d){
                history.back();
//                parent.changeCallParent();
            });
            break;
        case 'changeOnce':
            var update = {
                sid:sid,
                userid:userid,
                auth:auth,
                applyforid:urlobj.data.applyforid,
                status:$('#changeOnce').attr('data-status'),
                servicemanid:$('#serviceMan').attr('data-id')
            };
            Ajax(updateApply,'POST',update,function(d){
                history.back();
                parent.changeCallParent();
            });
            break;
        default :
            break;
    }
//    setTimeout(function(){
//        history.back();
//    },1000)
}

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
//    alert(JSON.stringify(oldData));
}//新旧data属性替换

function calendarConfirm(){
    setTimeout(function(){
        search();
    },100);

}//在calendar源码中新增了这个函数的绑定

function nodeSize(){
    var iconW = $('.icon-box').width() ,iconBW = $('.icon-box-big').width();
    var navW = $('.nav>ul').width() , navLiLen = $('.nav>ul>li').length;
//    $('.nav>ul>li').width(100 / navLiLen+"%");
    $(".icon-box").css({"height":iconW,"lineHeight":iconW+"px","fontSize":iconW/2+"px"});
    $(".icon-box-big").css({"height":iconBW,"lineHeight":iconBW+"px","fontSize":iconBW/2+"px"});
}
nodeSize();

var golbal = new Vue({
    el:"#myapp",
    data:{
        data:data,
        list:listObj,
        basic:basicObj,
        status:statusNum,
        con:configObj,
        slide:sliderData,
        scrollTopShow:''
    },
    methods:{
        jump: function(url,i){
            history.pushState('','xxx','./index.html');
            var urlObj;
            if(i){
                i.statuId = ajaxData.status;
                i.permission = permission;
                i = JSON.stringify(i);
                urlObj = url+'?'+i;
            }
            else{
                urlObj = url;
                if(!window.GreenSchool){
                    urlObj += '?sid='+ajaxData.sid+'&roleid='+ajaxData.roleid+'&userid='+ajaxData.userid+'&per='+permission;
                }
            }
            var iframe = $("<iframe style='width:100%;height:100%;border:none;' src='" + urlObj + " ' class='right-layer' name='myiframe'></iframe>");
            $('body').append(iframe);
            $('.right-layer').animate({'right':'0'});
        }
    },
    computed:{
        scrollTopShow: function(){

        }
    }
});

function isInArr(c,p){
    var state = false , len = p.length;
    for(var i = 0;i<len;i++){
        c == p[i] ? state = true : '';
    }
    return state;
}

///TEST
    window.onpopstate = function(){
        $('.right-layer').animate({'right':'-100%'},function(){
            $('.right-layer').remove();
        });
//        $('.right-layer').removeAttr('src');
    };
////

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
            index = $(node).find('#navCur').index();

        switch(dir){
            case '1':
                left <= 0 && left > -w/2 ? $(node).animate({'left':-cw + left},speed) : '';
                $(node).find('li').removeAttr('id').eq(index + 1).attr('id','navCur');
                break;
            case '-1':
                console.log(left+",,"+-w/2);
                left + 5 >= -w/2 && left <= -5 ? $(node).animate({'left':left + cw},speed) : '';
                $(node).find('li').removeAttr('id').eq(index - 1).attr('id','navCur');
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
//    ajaxData.repairdate = $('#startDate').val();
    ajaxData.repairdate = '2016-12-16';
    ajaxData.applyforclassid = $('#select_1').attr('data-id');
    ajaxData.equipmentid = $('#select_2').attr('data-id');
    ajaxData.placetypeid = $('#placetypeid').attr('data-id');
    ajaxData.priority = $('#priority').attr('data-id');
    ajaxData.pageIndexName = 1;
//    alert(JSON.stringify(ajaxData));
    getData(getList,'GET',ajaxData,transData,data);
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
        $(this).parent().siblings().find('.select_box').fadeOut();
        $(this).siblings('.select_box').fadeToggle();
    });

    $(document).on('click','.select_box>li',function(){
        var parent = $(this).parent();
        var text = $(this).text();
        var postId = $(this).attr('data-id');
        $(parent).fadeToggle();
        $(parent).siblings('.select').text(text);
        $(parent).siblings('.select').attr('data-id',postId);

        ///
    });


    $(document).on('click','#pri>li',function(){
        search();
    });

    $(document).on('click','#placeType>li',function(){
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

var popupData = {data:'',name:'',_thisNode:'',eqTypeid:'',isExist:''},
    aL = {bgLayout:false,popup:false};
new Vue({
    el:'#popup',
    data:{
        popup:popupData
    }
});



var pieceFunc = (function(){
    var url = location.href;
    return {
        getParentId: function(){
            var parentId = url.split('?')[1];
            parentId = parentId.split('=')[1];
            return parentId;
        },
        splitNavUrl: function(url,split,index){
            url = url.split(split)[index];
            return url;
        },
        setIndexList: function(arr,addUrl){
            for(var i in arr){
                arr[i].url = addUrl + arr[i].url;
                arr[i].inputtime = arr[i].inputtime.split(' ')[0];
            }
            return arr;
        },
        jointUrl: function(pre,behind){
            var all = encodeURI(pre + behind);
            console.log(all);
            return all;
        },
        getUrlParam: function(){
            var obj = {} ,_url = decodeURI(url);
            _url = _url.split('?')[1];
            _url = _url.split('&');
            for(var i in _url){
                obj[_url[i].split('=')[0]] =  _url[i].split('=')[1]
            }
            return obj;
        },
        historyState: function(){
            this._replace = function(){
                var id = $('.con_bar .cur').attr('href') , _url = url;
                _url = _url.split('&')[0];
                history.replaceState(null, "", _url+"&id=" + id)
            };
            this._push = function(){

            }
        },
        toFixed: function(a,b){
            var x = new Number(a);
            x = x.toFixed(b);
            return x;
        }
    }
})();