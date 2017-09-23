Date.prototype.parseDate = function (pattern) {
    /**
     * 分隔符只能是 - / 单个空格 : .
     * 年 YYYY || YY
     * 月 MM || M
     * 日 DD || DD 
     * 时 hh || h
     * 分 mm || m
     * 秒 ss || s
     * 毫秒 ms || msss
     * 
     * example: 
     *  d = new Date()
     *  d.parseDate('YYYY-MM-DD') // "2017-13-06"
     */
    var self = this;
    var parse = function (date) {
        var YYYY = date.getFullYear(),
            YY = ('' + YYYY).substr(2),
            M = date.getMonth() + 1,
            MM = ('0' + M).slice(-2),
            D = date.getDate(),
            DD = ('0' + D).slice(-2),
            h = (date.getHours() > 12)?(date.getHours()-12):date.getHours() ,
            // hh = ('0' + h).slice(-2),
            hh = (date.getHours() > 9)?date.getHours():'0' + date.getHours(),
            m = date.getMinutes(),
            mm = ('0' + m).slice(-2),
            s = date.getSeconds(),
            ss = ('0' + s).slice(-2),
            ms = date.getMilliseconds(),
            msss = ('00' + ms).slice(-3);
        return {
            YYYY: YYYY,
            YY: YY,
            M: M,
            MM: MM,
            D: D,
            DD: DD,
            h: h,
            hh: hh,
            m: m,
            mm: mm,
            s: s,
            ss: ss,
            ms: ms,
            msss: msss
        }
    };
    var format = function (date, pattern) {
        var result = '';
        var dateObj = parse(date);
        var splitArr = pattern.match(/(\w+((?=[\-\/ \:\.])|$))|([\-\/ \:\.]+)/g);
        var acceptReg = /YYYY|YY|M|MM|D|DD|h|hh|m|mm|s|ss|ms|msss/i;
        for (var i = 0, len = splitArr.length, item = ''; i < len; i++) {
            item = splitArr[i];
            if (acceptReg.test(item)) {
                item = dateObj[item];
            }
            result += item;
        }
        return result;
    };
    return format(self, pattern);
}