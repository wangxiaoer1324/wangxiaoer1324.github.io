// JavaScript Document
var arrImg=new Array();
var preloadedimages=new Array();
var picNum=0;
var scrollTime=3000; //Ä¬ÈÏ3Ãë
var isie=navigator.userAgent.toUpperCase().indexOf("MSIE")==-1?false:true;

function scrollStart(obj,sTime)
{
	var i = 0;
	$("#href_scroll").css("display","block");
	$("#"+obj+" a").map(function() {
		var arryuleImagObj=new Array();
		arryuleImagObj[0]=$(this).children("img").attr("src");
		arryuleImagObj[1]=$(this).attr("title");
		arryuleImagObj[2]=$(this).attr("href");
		arrImg[i]=arryuleImagObj;
		i++;
		$(".scroll_num").append("<span>"+i+"</span>");
	});
	if(sTime>1000) scrollTime=sTime;
	$("#img_scroll").mouseover(function(){clearTimeout(theTimer);});
	$("#img_scroll").mouseout(function(){clearTimeout(theTimer);theTimer=setTimeout('nextyulePic()', scrollTime);});
	$(".scroll_num span").mouseover(function(){clearTimeout(theTimer);});
	$(".scroll_num span").mouseout(function(){clearTimeout(theTimer);theTimer=setTimeout('nextyulePic()', scrollTime);});
	$(".scroll_num span").click(function (){
		$(".scroll_num span").removeClass("on");
		$(this).addClass("on");
		picNum = parseInt($(this).html())-1;
		clearTimeout(theTimer);
		if(isie) setTransition_yule();
		changeyuleImageInfo(picNum);
		if(isie) playTransition_yule();
	});
	$("#scroll_title").attr("title",arrImg[0][1]);
	$("#scroll_title").html(arrImg[0][1]);
	$("#scroll_title").attr("href",arrImg[0][2]);
	$(".scroll_num span:eq(0)").addClass("on");
	theTimer=setTimeout("nextyulePic()", scrollTime);
}

function nextyulePic()
{
	if(picNum<arrImg.length-1)
	{
		picNum++ ;
	}
	else
	{
		picNum=0;
	}
	if(isie) setTransition_yule();
	changeyuleImageInfo(picNum);
	if(isie) playTransition_yule();
	theTimer=setTimeout("nextyulePic()", scrollTime);
}

function changeyuleImageInfo(picNum)
{
	$("#img_scroll").attr("src",arrImg[picNum][0]);
	$("#img_scroll").attr("alt",arrImg[picNum][1]);
	$("#href_scroll").attr("href",arrImg[picNum][2]);
	$("#scroll_title").attr("title",arrImg[picNum][1]);
	$("#scroll_title").html(arrImg[picNum][1]);
	$("#scroll_title").attr("href",arrImg[picNum][2]);
	$(".scroll_num span").removeClass("on");
	$(".scroll_num span:eq("+(picNum)+")").addClass("on");
	$("#scroll_info p:eq("+(picNum)+")").css("display","block").siblings().css("display","none");
}

function setTransition_yule()
{
	$("#img_scroll")[0].filters.revealTrans.Transition=Math.floor(Math.random()*23);
	$("#img_scroll")[0].filters.revealTrans.apply();
}

function playTransition_yule()
{
	$("#img_scroll")[0].filters.revealTrans.play();
}<script>
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