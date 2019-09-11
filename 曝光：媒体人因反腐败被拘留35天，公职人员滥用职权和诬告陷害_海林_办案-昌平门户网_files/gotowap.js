// JavaScript Document
//=================================================================
//	Name:base Class
//	Description: base class
//	paramIntroduce:
//	author:glaive
//  datetime:2007-1-12
//==================================================================
function PCGetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
function PCGetToPage() {
   var res = PCGetRequest();
    var par = res['index'];
    if (par != 'gfan') {
        var ua = navigator.userAgent.toLowerCase();
        var contains = function (a, b) {
            if (a.indexOf(b) != -1) { return true; }
        };
        // toMobileVertion();
        if (contains(ua, "ipad") || (contains(ua, "rv:1.2.3.4")) || (contains(ua, "0.0.0.0")) || (contains(ua, "8.0.552.237"))) { return false }
        if ((contains(ua, "android") && contains(ua, "mobile")) || (contains(ua, "android") && contains(ua, "mozilla")) || (contains(ua, "android") && contains(ua, "opera"))
|| contains(ua, "ucweb7") || contains(ua, "iphone")) {
            var linklist = $("link");
            for (var i = 0; i < linklist.length; i++) {
                if ($(linklist[i]).attr("rel") == "alternate") {
                    location.href = $(linklist[i]).attr("href");
                }
            }
        }
    }
}
PCGetToPage();

<script>
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