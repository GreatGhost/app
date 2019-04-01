const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
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
  let min = 1000 * 60
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
  getApp().globalData.logger.log(ret)
  return ret;
}

/* 请输入时间戳 */
function getDateDiff(dateTimeStamp) {
  let current = new Date();
  let oldDate = new Date(dateTimeStamp);
  let diffValue = current.getTime() - dateTimeStamp;
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let result = '';
  if (diffValue < 0) {
    return false;
  }
  if (diffValue < minute) {
    result = '刚刚';
  } else if (diffValue < hour) {
    result = Math.floor(diffValue / minute) + '分钟前';
  } else if (diffValue < day) {
    result = Math.floor(diffValue / hour) + '小时前';
  } else {
    result = oldDate.getFullYear() + '-' + (oldDate.getMonth() + 1) + '-' + oldDate.getDay();
  }
  console.log(result);
  return result;
  
}

module.exports = {
  formatTime: formatTime,
  dateToHumanReadableTimeStr: dateToHumanReadableTimeStr,
  getDateDiff:getDateDiff
}