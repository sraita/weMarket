// 常用正则校验

// 手机号码校验
window.isMobileMumber = function (mobile){ 
   return  /^1[3|4|5|8][0-9]\d{8}$/.test(mobile)
}