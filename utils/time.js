const utility = require('./utility')
/**
 * 返回某年某月有几天
 * 日期处理中month是从0-11，在此我们也应该遵循这个惯例，比如month=1表示2月
 * 返回值是这个月有几天而非最后一天的日期，所以31天会返回31
*/
function getDaysInMonth(year,month){  
  month = parseInt(month,10) + 1;
  year = parseInt(year,10);
  var temp = new Date(year, month, 0);
  var ret = temp.getDate();
  return ret
}

function yyyyMMddhhmmssToDate(timestr) {
  if (timestr.length >= 8) {
    try {
      let year = timestr.substr(0, 4)
      let month = timestr.substr(4, 2) 
      month = Number(month) - 1
      let date = timestr.substr(6, 2)
      let hour = 0
      let min = 0
      let sec = 0
      if (timestr.length >= 10) {        
        hour = timestr.substr(8,2)
      }
      if (timestr.length >= 12) {        
        min = timestr.substr(10,2)
      }
      if (timestr.length >= 14) {        
        sec = timestr.substr(12,2)
      }

      return new Date(year, month, date, hour, min, sec)
    } catch(err) {
      console.error(err)
    }
  }
  return undefined
}

function getRequestFormatedDateString(date, fmt) {
  if (!date || !fmt) {
    return ''
  }
  Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) 
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));

  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
  }
  
  return date.Format(fmt)  
}

/**
 * 时间显示规则：
1.小于1分钟的显示刚刚。
2.大于1分钟，小于1小时的，显示XX分钟前
3.大于1小时，小于24小时的，显示X小时前
4.超出今天的显示昨天
5.超出昨天的，显示日期（月日的形式）
*/

function dateToHumanReadableTimeStr(date) {
  let current = (new Date()).getTime()
  let offset = current - date.getTime()
  let min =  1000 * 60
  let ret = ''
  if (offset < min) {
    ret = '刚刚'
  } else if (offset < min * 60) {
    let mins = (offset / min).toString()
    ret = mins.split('.')[0] + '分钟前'
  } else if (offset < min * 60 * 24) {
    let hours = (offset / (min * 60)).toString()
    ret = hours.split('.')[0] + '小时前'
  } else {
    ret = getRequestFormatedDateString(date, 'MM-dd')  
  }
  utility.logger.log(ret)
  return ret
}

module.exports = {
  yyyyMMddhhmmssToDate:yyyyMMddhhmmssToDate,
  getDaysInMonth: getDaysInMonth,
  dateToHumanReadableTimeStr:dateToHumanReadableTimeStr,
  getRequestFormatedDateString: getRequestFormatedDateString
}

/////////////////////////////////////////////////////////////////////////////////////
// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

// const formatNumber = n => {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }
