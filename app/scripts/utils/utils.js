/*
 * Created by caiq on 2017/2/9
 */

'use strict';

/* utils */

App.factory('VdmUtil', function (  ) {
  return {
    formatDate: function (tmpdate, fmt,val) {
      if(null===tmpdate){
        return null;
      }
      if(null===val) {
        val=0;
      }
      var date=new Date(tmpdate);
      date=new Date(date.getTime()+parseInt(val));
      var o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S": date.getMilliseconds()
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
      return fmt;
    },

    compareDate :function(checkStartDate,checkEndDate){
      if(checkStartDate !== null && checkEndDate !== null) {
        var arys1 = new Array();
        var arys2 = new Array();
        arys1=checkStartDate.split('-');
        var sdate=new Date(arys1[0],parseInt(arys1[1]-1),arys1[2]);
        arys2=checkEndDate.split('-');
        var edate=new Date(arys2[0],parseInt(arys2[1]-1),arys2[2]);
        if(sdate <= edate) {
          return true;
        }
        return false;//日期开始时间大于结束时间
      }
    },
    /**true:价格 false-不是价格*/
    validatePrice:function(value){
        var reg = new RegExp("^[0-9]+\.?[0-9]{0,2}$");
        if(!reg.test(value)){
            return false;
        }
      return true;
    },
    validateMobile: function (param) {
        if (!(/^1(3|4|5|7|8)\d{9}$/.test(param))) {
          return false;
        }
        return true;
      },
    validateInteger: function(param){
		if (!/^[0-9]*[1-9][0-9]*$/.test(param)) {
			return false;
		}
		
		return true;
	}
  };
});

App.factory('maps', function() {
  return {
    'bannerType':[
      {id:1, name:'首页Banner'},
      {id:2, name:'资讯Banner'},
      {id:3, name:'产品列表页Banner'}
    ],
    'goldAccountTradelog' : [
      {id: 1, name: '买金'},
      {id: 2, name: '卖金'},
      {id: 3, name: '提金'},
      {id: 16, name: '线下买金'}
    ],
    'periodUnit':[
      {id:1, name:'秒'},
      {id:2, name:'分'},
      {id:3, name:'小时'},
      {id:4, name:'天'}
    ],
    'profitType':[
      {id:1, name: '按日发放赠金'},
      {id:2, name:'一次性返还购金款及赠金'}
    ],
    'interestWay':[
      {id:1, name:'T+0'},
      {id:2, name:'T+1'}
    ],
    'prizeType': [
      {id:1, name:'实物'},
      {id:2, name: '优惠券'},
      {id:3, name :'谢谢参与'}
    ],
    'status': [
      {id:1, name : '已领取'},
      {id:2, name : '未领取'},
    ]
  };
});
