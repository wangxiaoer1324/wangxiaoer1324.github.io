function User() {
}

User.Login = function (f) {
    var _this = this;
    this.login = function () { if (typeof f == 'function') f(); else User.StateHtml($(".mnw_log_status")); };
    this.updateState = function () { alert("update"); };
    if (window.loginForm == null)
        window.loginForm = new LoginForm();
    window.loginForm.addTrigger(_this);


    window.loginForm.login();

};
User.Logout = function (f) {

    this.logout = function () { if (typeof f == 'function') f(); else User.StateHtml($(".mnw_log_status")); };
    if (window.loginForm == null)
        window.loginForm = new LoginForm();
    window.loginForm.addTrigger(this);

    window.loginForm.logout();

}

User.State = function () {
    var username = $.cookie(COOKIE_PRE + "username");
    var userid = $.cookie(COOKIE_PRE + "userid");
    if (userid == null) {
        return { IsLogin: false };
    } else {
        return { IsLogin: true, UserName: username, UserId: userid };
    }

}

User.StateHtml = function (box) {
    var state = User.State();
    if (state.IsLogin) {
        $(box).html("<span class='welcome'>您好,<a target='_blank' href='http://app.mnw.cn/?app=member'>" +
                   state.UserName + 
                   "</a></span> | <a target='_blank' href='http://app.mnw.cn/?app=member' class='manage'>管理</a> | " +
                   "<a href='javascript:;' onclick='User.Logout();' class='logout'>退出</a>");
		if($("#participate").length>0)
		{
			$("#participate").attr('href',APP_URL+'?app=baby&controller=index&action=participate');
		}
    }
    else {
        $(box).html("&nbsp;<a href='javascript:;' onclick='User.Login();' class='mod_passwords'>登录</a> | " +
                    "&nbsp;<a href='http://app.mnw.cn/?app=member&controller=index&action=register' class='mod_passwords'>注册</a>");
    }
}
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