(function(){var d=function(a,c){return function(){return a.apply(c,arguments)}},b=function(){this.update=d(this.update,this);this.logout=d(this.logout,this);this.login=d(this.login,this);g.dialog=new dialog({hasOverlay:1,hasCloseIco:1,width:384,height:222})},g;g=b;b.dialog=null;b.prototype.tag=null;b.prototype.triggers=[];b.prototype.login=function(a){var c=this;a&&(this.tag=a);if(!this.getDialog().isOpen)return $.getJSON(APP_URL+"?app=member&controller=index&action=loginform&jsoncallback=?",function(a){if(a)return c.getDialog().open({html:a})})};
b.prototype.logout=function(){var a=this;return $.getJSON(APP_URL+"?app=member&controller=index&action=ajaxlogout&jsoncallback=?",function(c){return!c||!c.state?alert("\u9000\u51fa\u5931\u8d25"):a.update()})};b.prototype.update=function(){var a,c,b,f,e,d;if((a=$.cookie(COOKIE_PRE+"thirdtoken"))&&a.length)a=encodeURIComponent(location.href),location.href=APP_URL+"?app=member&controller=index&action=registerwithtoken&ref="+a;if($.cookie(COOKIE_PRE+"auth")){c=$.cookie(COOKIE_PRE+"username");e=this.triggers;
d=[];b=0;for(f=e.length;b<f;b++)a=e[b],d.push(a.login(c));"changyan"===this.tag&&"undefined"!==typeof SOHUCS&&SOHUCS.reset();return d}f=this.triggers;e=[];c=0;for(b=f.length;c<b;c++)a=f[c],e.push(a.logout());return e};b.prototype.addTrigger=function(a){return this.triggers.push(a)};b.prototype.getDialog=function(){return g.dialog};this.LoginForm=b}).call(this);
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