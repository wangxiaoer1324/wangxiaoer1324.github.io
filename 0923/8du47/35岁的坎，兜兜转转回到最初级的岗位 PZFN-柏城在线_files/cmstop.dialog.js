window.dialog=function(s){var a=s||{},d=this,e,j,h=null,p=/opera/.test(navigator.userAgent.toLowerCase())?0:6==parseInt((/.+msie[\/: ]([\d.]+)/.exec(navigator.userAgent.toLowerCase())||{1:0})[1]),k=!1,l,f=function(a,b,d){var a=a||{},b=b||{},i=document.createElement("div"),g;for(g in a)"class"==g?(i.setAttribute("class",a[g]),i.setAttribute("className",a[g])):i.setAttribute(g,a[g]);for(g in b)i.style[g]=b[g];d||(d=document.body);d.appendChild(i);return i},q=function(){var a=window.innerWidth;void 0==
a&&(a=document.documentElement.clientWidth);return a},r=function(){var a=window.innerHeight;void 0==a&&(a=document.documentElement.clientHeight,a=window.screen.height-100<a?window.screen.height-100:a);return a},m=function(a,b,d){window.addEventListener?a.addEventListener(b,function(b){d(a,b)},!1):window.attachEvent&&a.attachEvent("on"+b,function(b){d(a,b)})};d.isOpen=!1;d.miniWin=!1;d.open=function(c){var b;if("object"==typeof c)for(b in c)a[b]=c[b];if(!d.isOpen){d.isOpen=!0;k=!a.top&&!a.left;a.shadow=
void 0==a.shadow?16:a.shadow;a.width=a.width+a.shadow||400;a.height=a.height+a.shadow||(a.confirm?180:280);a.title=a.title||"";b=k&&!a.left?(q()-a.width)/2:a.left;0>b&&(b=0);b+="px";c=k&&!a.top?(r()-a.height)/2:a.top;0>c&&(c=0);p&&(c+=document.documentElement.scrollTop);c+="px";a.hasOverlay&&(j=f({"class":"dialog-overlay"},{height:Math.max(document.documentElement.clientHeight,document.body.scrollHeight,document.documentElement.scrollHeight,document.body.offsetHeight,document.documentElement.offsetHeight)+
"px"}));e=f({"class":"dialog-container"},{width:a.width+"px",height:a.height+"px",left:b,top:c});f({"class":"dialog-shadow"},{},e);h=f({"class":"dialog-panel"},{width:a.width-a.shadow+"px",height:a.height-a.shadow+"px",left:a.shadow/2+"px",top:a.shadow/2+"px"},e);a.hasCloseIco&&(b=f({"class":"dialog-close ie6Opacity"},{},e),m(b,"click",d.close));if(a.url)b=d.iframe=document.createElement("iframe"),b.src=a.url,b.style.width="100%",b.style.height="100%",b.frameBorder=0,h.appendChild(b);else if(a.html){var n=
[];a.html=a.html.replace(/<script(?:[^>]+?type="([^"]*)")?[^>]*>([^<][\s\S^(?:<\/script>)]+?)<\/script>/ig,function(a,b,c){if(b&&"text/javascript"!=b)return a;n.push(c);return""});h.innerHTML=a.html;b=0;for(c=n.length;b<c;b++)window.eval.call(window,n[b])}else"function"==typeof a.confirm?(b=f({"class":"dialog-confirm-panel"},{},h),f({"class":"dialog-info-ico"},{marginRight:"12px"},b),f({"class":"dialog-confirm-info"},{display:"inline-block"},b).innerHTML=a.text||"",c=f({"class":"dialog-confirm-select"},
{},h),b=f({"class":"dialog-btn"},{margin:"0 6px"},c),b.innerHTML="\u786e\u5b9a",c=f({"class":"dialog-btn"},{margin:"0 6px"},c),c.innerHTML="\u53d6\u6d88",m(b,"click",a.confirm),m(b,"click",d.close),m(c,"click",d.close)):a.text&&(h.innerHTML='<p style="line-height: '+(a.height-a.shadow)+'px; text-align:center;">'+a.text+"</p>");a.closeDelay&&setTimeout(d.close,a.closeDelay);l=window.onresize;k&&(window.onresize=function(){"function"==typeof l&&l();var b=(q()-a.width)/2;0>b&&(b=0);var b=b+"px",c=(r()-
a.height)/2;0>c&&(c=0);p&&(c+=document.documentElement.scrollTop);e.style.top=c+"px";e.style.left=b})}};d.close=function(){d.isOpen&&(d.isOpen=!1,j&&j.parentNode.removeChild(j),e&&e.parentNode.removeChild(e),window.onresize=l)};d.resize=function(c,b){c&&0<c&&(e.style.width=c+a.shadow+"px",h.style.width=c+"px");b&&0<b&&(e.style.height=b+a.shadow+"px",h.style.height=b+"px")}};
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