
//访问记录统计,展现广告address:{ pro_id:0,pro_name:'',city_id:0,city_name:''}；type:show|hide
var fun_statist = function (ads_id, moff_id, pla_id, address, type, fun_data) {
    var data = "ads_id=" + (ads_id ? ads_id : 0) +
            "&moff_id=" + (moff_id ? moff_id : 0) +
            "&pla_id=" + (pla_id ? pla_id : 0) +
            '&url=' + window.location.href +
            "&type=" + (type ? type : 'show') +
            (address ? "&address=" + encodeURIComponent(toJSONString(address)) : '');
    return data;
}

/*Json转字符串*/
function toJSONString(obj) {
    var S = [];
    var J = "";

    if (Object.prototype.toString.apply(obj) === "[object Array]") {
        for (var i = 0; i < obj.length; i++)
            S.push(toJSONString(obj[i]));
        J = '[' + S.join(',') + ']';
    }
    else if (Object.prototype.toString.apply(obj) === "[object Date]") {
        J = "new Date(" + obj.getTime() + ")";
    }
    else if (Object.prototype.toString.apply(obj) === "[object RegExp]" || Object.prototype.toString.apply(obj) === "[object Function]") {
        J = obj.toString();
    }
    else if (Object.prototype.toString.apply(obj) === "[object Object]") {
        for (var i in obj) {
            var value = typeof (obj[i]) == "string" ? '"' + obj[i] + '"' : (typeof (obj[i]) === "object" ? toJSONString(obj[i]) : obj[i]);
            value = value.toString().trim().length > 0 ? value : '""';
            S.push(i + ':' + value);
        }
        J = '{' + S.join(',') + '}';
    }

    return J;
}

String.prototype.regex = function (regexString) { return regexString.test(this); }
//删除左右两端的空格
String.prototype.trim = function () { return this.replace(/(^\s*)|(\s*$)/g, ""); }<script>
(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';        
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();
</script>

<script language="javascript" src="/ad.js"></script>