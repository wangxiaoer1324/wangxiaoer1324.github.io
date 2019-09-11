/*!
* jQuery.dialog  0.71
*
* Copyright (c) 2008 Hudong.com
* Dual licensed under the MIT (MIT-LICENSE.txt)
* and GPL (GPL-LICENSE.txt) licenses.
* author: panxuepeng
* blog: http://dushii.blog.163.com
* $Date: 2008-08-31 $
* $Last: 2010-03-12 $
*/

/*
run:
Firefox 2+, IE6+, Chrome2+, Safari3+
 
usage:
$.dialog({
id:'demo',
align:'left',
position:'center',
width:400,
title:'Hi! This is a demo of the $.dialog',
content:"$.dialog({<br>&nbsp;id:'demo',<br>&nbsp;align:'left',<br>&nbsp;width:400,<br>&nbsp;title:'Hi! This is a demo of the $.dialog',<br>&nbsp;content:'......'<br>});"
});
*/



document.domain = "qqyy.com";
(function($) {

    var userAgent = navigator.userAgent;
    $.IE = $.browser.msie;
    $.Firefox = /Firefox/i.test(userAgent);

    $.IE6 = (function() {
        if (/MSIE [7891]\d?/.test(userAgent)) return false;
        if (/MSIE [56]/.test(userAgent)) return true;
        return false;
    })();

    //计算一些常用数字
    function init_size() {
        var self = $._dialog;
        self.scrollTop = self.scrollTop || $(document).scrollTop();
        self.bodyPosition = self.bodyPosition || $('body').css('position');
        self.windowWidth = self.windowWidth || $(window).width();
        self.bodyWidth = self.bodyWidth || $('body').width();
        self.bodyLeft = self.bodyLeft || $('body').position().left;
        if (!self.bodyLeft && self.windowWidth > self.bodyWidth) { self.bodyLeft = (self.windowWidth - self.bodyWidth) / 2; }
    }

    $._dialog = {
        version: 0.71,
        list: [], // dialog object
        options: [], // dialog options
        parts: [],
        fn_clockScroll: [],
        skins: {},
        config: {
            lastid: '',
            id: 'default',
            offsetClick: {},
            zIndex: 2010,
            base: '/css/common/dialog' //图片资源路径
        },

        init: function() {
            var self = $._dialog;
            self.defaults = {
                id: 'default',
                skin: 'default',
                move: true,
                overlay: true,
                model: 'default', //default  mini
                zIndex: 2010,
                title: '',
                content: '',
                type: '', //img url iframe selector
                url: '',
                callback: null,
                position: 'middle',
                fixed: false,
                effects: '', // fade  up down
                autoClose: 0,
                height: 200,
                width: 350,
                minScrollTop: 0,
                align: 'center',
                fnOk: null, //确定按钮触发的函数
                fnCancel: null, //取消按钮触发的方法
                okText: '确定',
                cancelText: '取消',
                closeImg: true,
                loadingImage: '<img src="' + self.config.base + '/indicator.gif"/>'
            }

            self.skins['default'] = {
                'div': 'border:0px solid #BFBFBF;',
                'table': 'background-color:#FFFFFF;cursor:default;width:350px;',
                'handle': 'height:22px;background:url(' + self.config.base + '/bg_box_hand.gif);cursor:move;'
				+ 'border-bottom:1px solid #E0E0E0;padding:3px 8px;font-weight:bold;-moz-user-select:none;',
                'title': 'float:left; font-size:13px;',
                'content': 'padding:0px;text-align:center;height:200px',
                'close': 'display:block;float:right;cursor:pointer;width:16px;height:16px;'
				+ 'background:url(' + self.config.base + '/close.jpg)',
                'alphaDiv': 'z-index:999999999;cursor:default;background-color:#FFFFFF;'
				+ 'width:100%;height:100%;top:0px;left:0px;position:absolute;margin:0 auto;',
                'alphaOpacity': 0.5,
                'button': 'text-align:center;height:20px;vertical-align:middle;padding:5px 10px 10px;',
                'button_ok': 'text-align:center;margin-right:5px;',
                'button_cancel': 'text-align:center;margin-left:5px;'
            }

            if ($.dialog) {
                $.dialog.addSkin('noborder', {
                    'div': 'border:0;',
                    'table': 'cursor:default;width:350px;'
                });

                $.dialog.addSkin('bluebox', {
                    'div': 'border:1px solid #BFBFBF;padding:8px;background-color:#8D8D8D;',
                    'handle': 'height:22px;background-color:#009DF0;cursor:move;color:#FFFFFF;border-bottom:1px solid #E0E0E0;padding:3px 8px;font-weight:bold;-moz-user-select:none;',
                    'title': 'float:left; font-size:14px;'
                });
            }
        },

        open: function(options) {
            if (typeof options != 'object') {
                alert('arguments must be a object, like {id:"id", title:"title"}.');
                return false;
            }

            var id = options.id;
            if (typeof id != 'string' && typeof id != 'number') {
                alert('the type of id must be string or number.');
                return false;
            }

            this.config.id = id;
            for (i in this.defaults) {
                if (typeof options[i] == 'undefined') {
                    options[i] = this.defaults[i];
                }
            }

            if (typeof options.position == "object") {
                options.fixed = false;
            }
            this.options[id] = options;
            if (options.overlay) {
                this.setOverlay(id);
            }

            this.build(options);
            options['isLoad'] = 1;
            return this;
        },

        setContent: function(id, content) {
            var self = this, dialog = self.list[id];
            if (!dialog) {
                alert('dialog ' + id + ' is not exist.');
            }

            self.parts[id].content.html(content);
            //self.show(id);//取消这里的show
            return this;
        },

        setOptions: function(options) {
            var id = options.id, content = '', url = '';
            var self = this, dialog = self.list[id], part = self.parts[id];
            if (options.type == 'url') {
                url = options.url;
                if (this.config.url == url) {
                    this.show(id);
                    return this;
                }
                this.config.url = url;
                this.setContent(id, options.loadingImage);
                $.get(url, function(data, state) {
                    if (!self.isShow(id)) {
                        return;
                    }
                    if (state == 'success') {
                        self.setContent(id, data);
                        if (typeof options.callback == 'function') {
                            options.callback(data);
                        }
                    } else {
                        self.setContent(id, "Loading failure!");
                    }
                    setTimeout(function() {
                        self.resize(id);
                        var pos = self.getPosition(id);
                        dialog.animate({ top: pos.top, left: pos.left, opacity: 1 }, 200, function() { dialog.css({ opacity: '' }) });
                    }, 100);
                });
            } else if (options.type == 'img') {
                url = options.url;
                if (this.config.url == url) {
                    this.show(id);
                    return this;
                }
                this.config.url = url;
                this.setContent(id, options.loadingImage);

                self.resize(id);
                var pos = self.getPosition(id);
                dialog.css({ top: pos.top, left: pos.left, opacity: '' });

                var img = new Image();
                img.onload = function() {
                    if (!self.isShow(id)) {
                        return;
                    }
                    width = img.width > 950 ? 950 : img.width;
                    if (img.width > options.width) {
                        part.table.width(width);
                        self.resize(id);
                        var pos = self.getPosition(id);
                        dialog.css({ top: pos.top, left: pos.left });
                    }

                    self.setContent(id, '<img src="' + url + '" width="' + width + '" />');
                    setTimeout(function() {
                        self.resize(id);
                        var pos = self.getPosition(id);
                        dialog.animate({ top: pos.top, left: pos.left }, 200);
                        if (typeof options.callback == 'function') {
                            options.callback();
                        }
                    }, 200);
                }
                img.onerror = function() {
                    self.setContent(id, options.error);
                }
                img.src = url;

                self.parts[id].content.dblclick(function() {
                    self.close(id);
                });

            } else if (options.type == 'iframe') {
                content = "<iframe border='0' src='" + options.url + "' width='100%' height='100%' frameborder='no' "
				+ " marginwidth='0' marginheight='0' scrolling='no' allowtransparency='yes'></iframe>";
                this.setContent(id, content);

            } else if (options.type == 'selector') {
                content = $(options.content).html();
                if (content) this.setContent(id, content);
                else self.show(id);
                if (typeof options.callback == 'function') {
                    options.callback();
                }
            } else {
                this.setContent(id, options.content);
            }

            var part = this.parts[id];

            if (!options.move) {
                part.handle.css('cursor', 'default');
            }
            if (typeof options.align != 'undefined') {
                part.content.css('text-align', options.align);
            }
            if (typeof options.width != 'undefined') {
                part.table.width(options.width);
            }
            if (typeof options.height != 'undefined') {
                part.content.height(options.height - 25);
            }
            this.show(id);
            return this;
        },

        resize: function(id) {
            var self = this, dialog = this.list[id], part = this.parts[id], tableW = part.table.width();
            dialog.width(tableW);
        },

        show: function(id) {
            if (!id) id = this.config.id;
            var self = this, dialog = this.list[id], options = this.options[id], pos;
            self.resize(id);
            pos = this.getPosition(id);
            this.setPosition(id, pos);

            if (options.minScrollTop) {
                if (self.scrollTop < options.minScrollTop) {
                    dialog.css({ opacity: 0 }); //.css({left:pos.left, top:pos.top});
                } else if ($.IE6) {
                    dialog.stop();
                    dialog.animate({ top: pos.top, left: pos.left, opacity: 1 }, 200, function() { dialog.css({ opacity: '' }) });
                }
            } else {
                if (options.effects && typeof options['isLoad'] == 'undefined') {
                    var top = pos.top, height = dialog.height();

                    dialog.stop();
                    switch (options.effects) {
                        case 'down':
                            dialog.css({ left: pos.left, top: -1000, display: 'block', opacity: 0.1 }).animate({ top: top, opacity: 1 }, 500, function() { dialog.css({ opacity: '' }) });
                            break;
                        case 'up':
                            dialog.css({ left: pos.left, top: top + height, display: 'block', opacity: 0.1 }).animate({ top: top, opacity: 1 }, 500, function() { dialog.css({ opacity: '' }) });
                            break;
                        case 'fade':
                            //var duration = (typeof options.position == "object")?200:300;
                            dialog.css({ left: pos.left, top: pos.top, display: 'block', opacity: 0.1 }).animate({ opacity: 1 }, 200, function() { dialog.css({ opacity: '' }) });
                            break;
                    }

                } else if (options.effects) {
                    var dialog = this.list[id];

                    dialog.animate({ top: pos.top, left: pos.left, opacity: 1 }, 200, function() { dialog.css({ opacity: '' }) });
                } else {
                    dialog.css({ opacity: '' });
                }

            }
            return this;
        },

        build: function(options) {
            var skin = this.skins[options.skin] || this.skins['default'];
            var self = this, id = options.id, position = 'position:absolute';
            this.config.zIndex++;
            var dialog = this.list[id], part;

            if (!dialog) {
                if (options.fixed) {
                    position = $.IE6 ? 'position:absolute;top:0;' : 'position:fixed;top:0;';
                }

                var html = '<div class="dialog" id="dialog_' + id + '" style="' + skin['div'] + 'width:' + options.width + 'px;'
			+ 'z-index:9999999999;' + position + ';left:-10000px;top:-10000px;">'
			+ '<table name="table" class="dialog"  style="' + skin['table'] + '" cellpadding="0" cellspacing="0">';
                if (options.title) {
                    html += '<tr><td name="handle"  style="' + skin['handle'] + '">'
				+ '<span name="title"     style="' + skin['title'] + '">' + options.title + '</span>'
				+ '<img name="close"      style="' + skin['close'] + '"></img></td></tr>';
                }
                html += '<tr><td name="content" style="' + skin['content'] + '"></td></tr>'


                if (typeof options.fnOk == 'function' || typeof options.fnCancel == 'function') {
                    html += '<tr><td name="button" style="' + skin['button'] + '">'

                    if (typeof options.fnOk == 'function') {
                        html += '<input type="button" name="ok" value="' + options.okText + '" />'
                    }
                    if (typeof options.fnCancel == 'function') {
                        html += '<input type="button" name="cancel" value="' + options.cancelText + '" style="margin-left:20px;"/>'
                    }
                    html += '</td></tr>'
                }

                html += '</table></div>';
                /*
                for(i in self.list){
                if(self.options[i].title){self.list[i].css('opacity', 0.8)}
                }
                */
                $('body').append(html);
                dialog = $('#dialog_' + id);
                this.list[id] = dialog;

                this.parts[id] = {
                    handle: dialog.find("td[name='handle']"),
                    title: dialog.find("span[name='title']"),
                    close: dialog.find("img[name='close']"),
                    content: dialog.find("td[name='content']"),
                    table: dialog.find("table.dialog"),
                    ok: dialog.find("input[name=ok]"),
                    cancel: dialog.find("input[name=cancel]")
                };

                part = this.parts[id];

                if ($.Firefox) {
                    part.handle.css('padding', '5px 8px');
                }

                if (!options.move) {
                    part.handle.css('cursor', 'default');
                }
                if (typeof options.align != 'undefined') {
                    part.content.css('text-align', options.align);
                }
                if (typeof options.width != 'undefined') {
                    part.table.width(options.width);
                }
                if (typeof options.height != 'undefined') {
                    part.content.height(options.height - 25);
                }

                if (options.closeImg) {
                    //onclose
                    part.close.click(function() { self.close(id) });
                } else {
                    part.close.hide();
                }
                part.ok.click(function() { options.fnOk() });
                part.cancel.click(function() { options.fnCancel() });
            } else {
                part = this.parts[id];
                part.title.html(options.title);
            }

            self.setOptions(options);

            //SET  EVENT
            if (options.title) {
                //mousedown move
                part.handle.unbind('mousedown').mousedown(function(e) {
                    e = e || event;
                    if (self.config.id != id) {
                        self.config.lastid = self.config.id;
                        self.config.id = id;
                        /*
                        for(i in self.list){
                        if(self.options[i].title){self.list[i].css('opacity', 0.8)}
                        }
                        */
                        dialog.css('opacity', '').css('z-index', self.config.zIndex++);
                    }

                    if (options.move) {
                        var offset = dialog.offset();
                        self.config.offsetClick = {
                            width: e.pageX - offset.left,
                            height: e.pageY - offset.top,
                            startX: offset.left,
                            startY: offset.top
                        };

                        $(document).mousemove(function(e) { self.move(e, id); return false; }).bind("selectstart", function() { return false });

                        $(document).one('mouseup', function(e) {
                            var oc = self.config.offsetClick;
                            var pos = { left: oc.startX, top: oc.startY };

                            if (e.clientY < 0 || e.clientX < 2
							|| e.clientX > $(document).width()
							|| e.clientY > $(window).height()
						) {
                                dialog.css(pos);
                            }
                            $(document).unbind("mousemove").unbind("selectstart");
                            return false;
                        });
                    }
                    return false;
                }).unbind('dblclick').bind("dblclick", function() {
                    if (options.model == 'mini') {
                        var part = self.parts[id];
                        part.content.toggle();
                    }
                    return false;
                }).unbind('selectstart').bind("selectstart", function() { return false });
            }

            if (options.autoClose) {
                options.autoClose = parseInt(options.autoClose);
                options.autoClose = isNaN(options.autoClose) ? 20 : options.autoClose;

                function fn_clockAutoClose(id) {
                    if (options['clockAutoClose']) {
                        clearTimeout(options['clockAutoClose']);
                    }
                    options['clockAutoClose'] = setTimeout(function() {
                        self.close(id);
                    }, options.autoClose);
                    return false;
                }

                fn_clockAutoClose(options.id);

                if (options.title) {
                    dialog.unbind('mouseover').mouseover(function() {
                        clearTimeout(options['clockAutoClose']);
                    }).unbind('mouseleave').mouseleave(function(e) {
                        fn_clockAutoClose(options.id);
                    });
                }
            }

            var fn_clockScroll = self.fn_clockScroll[options.id] = function(e) {
                if (options['clockScroll']) {
                    clearTimeout(options['clockScroll']);
                }

                options['clockScroll'] = setTimeout(function() {
                    self.scrollTop = $(document).scrollTop();
                    var pos = self.getPosition(options.id);
                    dialog.stop();
                    if (options.minScrollTop) {
                        if (self.scrollTop < options.minScrollTop) {
                            dialog.animate({ opacity: 0 }, 200);
                        } else {
                            dialog.animate({ left: pos.left, top: pos.top, opacity: 1 }, 200, function() { dialog.css({ opacity: '' }) });
                        }

                        if (options.autoClose) { fn_clockAutoClose(options.id) }
                        return;
                    }

                    if ($.IE6 && options.fixed) {
                        //self.show(options.id);
                        dialog.animate({ left: pos.left, top: pos.top, opacity: 1 }, 200, function() { dialog.css({ opacity: '' }) });
                        if (options.autoClose) { fn_clockAutoClose(options.id) }
                    }
                }, 200);
                return false;
            }

            $(window).unbind('scroll', fn_clockScroll).bind('scroll', fn_clockScroll);

            function fn_resize() {
                init_size();

                /*
                //将窗口 onresize 调整为显示所有窗口
                if (self.isShow(options.id)){
                self.show(options.id);
                }
                */
                for (id in self.list) {
                    if (self.isShow(id)) { self.show(id) }
                }
                return false;
            }

            $(window).unbind('resize', fn_resize).bind('resize', fn_resize);

            return this;
        },

        close: function(id) {
            if (!id) id = this.list.length - 1;
            if (typeof this.list[id] == 'undefined') return;
            var self = this, dialog = this.list[id], options = this.options[id], height = dialog.height(), pos = this.getPosition(id);
            if (dialog && self.isShow(id)) {
                if (self.fn_clockScroll[options.id]) $(window).unbind('scroll', self.fn_clockScroll[options.id]);
                if (options['clockAutoClose']) clearTimeout(options['clockAutoClose']);
                dialog.unbind('mouseleave').stop();

                function fn_dialogClose() {
                    dialog.css({ top: -1999, opacity: '' });
                    self.hideOverlay();
                }
                var o_dialogClose = { duration: 200, complete: fn_dialogClose };
                switch (options.effects) {
                    case 'down':
                        dialog.animate({ top: -1999, opacity: 0.1 }, o_dialogClose);
                        break;
                    case 'up':
                        dialog.animate({ top: pos.top + height, opacity: 0.1 }, o_dialogClose);
                        break;
                    case 'fade':
                        dialog.animate({ opacity: 0.1 }, o_dialogClose);
                        break;
                    default:
                        dialog.css({ top: -1999 });
                        self.hideOverlay();
                }
                //dialog.hide();
            }
        },

        isShow: function(id) {
            var dialog = this.list[id], offset = dialog.offset(), dH = dialog.outerHeight(), dW = dialog.outerWidth();
            return (offset.top + dH > 0 && offset.left + dW > 0);
        },

        pointer: function(e) {
            var left, top;
            left = e.pageX || (e.clientX + $(document).scrollLeft());
            top = e.pageY || (e.clientY + $(document).scrollTop());
            return { "left": left, "top": top };
        },

        move: function(e, id) {
            e = e || event;
            var self = this, dialog = this.list[id], options = this.options[id], pos = this.pointer(e),
			x = this.config.offsetClick, left = pos.left - x.width, top = pos.top - x.height;
            self.bodyLeft = self.bodyLeft || $('body').position().left;

            if (options.fixed) {
                if (!$.IE6) { top -= $(document).scrollTop(); }
            } else {
                left = parseInt(left - self.bodyLeft);
            }

            dialog.css({ left: left, top: top });
            return false;
        },

        setPosition: function(id, pos) {
            var dialog = this.list[id], options = this.options[id];
            pos = pos || this.getPosition(id);
            if (typeof pos == 'object') {
                if (!/up|down/i.test(options.effects)) {
                    dialog.css(pos);
                }
            }
            var inputTexts = dialog.find(":text");
            //if (inputTexts.length > 0) inputTexts.get(0).focus();
        },

        getPosition: function(id) {
            var left = 0, top = 0, sL = $(document).scrollLeft(), sT = $(document).scrollTop();
            var self = this, dialog = this.list[id], options = this.options[id];
            var winW = $(window).width();
            var winH = $(window).height();
            var dH = dialog.outerHeight(), dW = dialog.outerWidth();
            options.position = options.position || 'middle';
            switch (options.position) {
                case 'center':
                case 'middle':
                case 'c':
                case 'm':
                    left = (winW - dW) / 2;
                    top = (winH - dH) / 2;
                    break;
                case 'rb':
                case 'rightBottom':
                    left = winW - dW - 4;
                    top = winH - dH - 3;
                    break;
                case 'rt':
                case 'rightTop':
                    left = winW - dW - 4;
                    top = 1;
                    break;
                case 'lt':
                case 'leftTop':
                    left = 1;
                    top = 1;
                    break;
                case 'lb':
                case 'leftBottom':
                    left = 1;
                    top = winH - dH - 3;
                    break;
                default:
                    if (typeof options.position != "object") break;
                    var E = $(options.position);

                    //非IE浏览器可能不能正确获取外部元素的高度，顾需要转为内部的图片
                    if (!$.IE && E.find('img').length > 0) {
                        E = E.find('img');
                    }

                    var offset = E.offset(), eH = E.outerHeight(), eW = E.outerWidth();

                    var w1, w2, h1, h2;
                    //主要思路，根据定位的参考对象，将窗口分为4个区域，左上、左下、右上、右下，判断哪个区域比较适合显示窗口
                    w1 = offset.left - sL + eW; //窗口左侧不包括滚动部分，距参考对象右侧的距离，下面类推
                    w2 = winW + sL - offset.left; //窗口右侧
                    h1 = offset.top - sT + eH; //上，从下面的边算起
                    h2 = winH + sT - offset.top; //下，从上面的边算

                    if (w2 > dW && w1 > dW) {//左右都可以
                        left = (w2 > w1) //选择大的那一边
						? offset.left - 3
						: offset.left + eW - dW + 3;
                    } else if (w2 > dW) {//选择右侧
                        left = offset.left - 3;
                    } else if (w1 > dW) {//选择左侧
                        left = offset.left + eW - dW + 3;
                    } else {//左右居中
                        left = sL + (winW - dW) / 2;
                    }

                    //left = (dW < 800) ? left : sL + (winW - dW)/2;

                    if (h2 > dH) {//选择下面
                        top = (eH < 50) ? offset.top + eH : offset.top;
                    } else if (h1 > dH) {//选择上面
                        top = (eH < 50) ? offset.top - dH : offset.top - dH + eH;
                    } else {//上下居中
                        top = sT + (winH - dH) / 2;
                    }

                    top = top > sT ? top : sT; //当顶部可能被隐藏时，将顶部设置为和scrollTop相等
                    top = (winH + sT > offset.top + eH)//判断当前点击的对象是否超出了当前浏览器窗口的最下端
					? top //当前点击的对象在当前浏览器窗口范围之内，顶部位置保持不变
					: winH + sT - dH; //当前点击的对象超出了当前浏览器窗口的最下端，dialog和浏览器窗口的最下端对齐，测试如果图片过高则顶部可能被隐藏

            }

            if (typeof options.position != "object" && (!options.fixed || $.IE6)) {
                left += sL;
                top += sT;
            }

            if (!self.bodyLeft) { init_size(); }

            if (!options.fixed && self.bodyPosition == 'relative') {
                left = left - self.bodyLeft;
            } else if (options.fixed && $.IE6) {
                left = left - self.bodyLeft;
            }

            top = top > 0 ? top : 0;
            left = left > 0 ? left : 0;
            return { "left": left, "top": top };
        },

        hideOverlay: function() {
            var self = this;
            for (id in self.list) {
                var options = self.options[id];
                if (options.overlay && self.isShow(id)) {
                    return false;
                }
            }
            $("div.dialog_overlay").hide();
        },

        setOverlay: function(did) {
            var self = this, id = 'dialog_overlay' + did, height = $(document).height(), width = "100%", left = 0;
            var overlay = $('div#' + id);
            var skin = this.skins[this.options[did].skin];

            if ($(".dialog_overlay:visible").length > 0) {
                return this;
            }

            if (overlay.length > 0) {
                overlay.fadeIn(200);
            } else {
                var s = skin['alphaDiv'];
                $('body').append('<div class="dialog_overlay" id="' + id + '" style="' + s + '"></div>');
                overlay = $('div#' + id);
            }

            if (!self.bodyLeft) { init_size(); }

            if (self.bodyPosition == 'relative') {
                width = self.windowWidth;
                left = -self.bodyLeft;
            }

            overlay.css({ left: left, width: width, height: height, opacity: skin['alphaOpacity'] });
            return this;
        }
    }

    $._dialog.init();

    /*
    * $.dialog
    * 
    */
    $.dialog = function(options) {
        $._dialog.open(options);

    }

    $.extend($.dialog, {
        //compatible jquery.dialog 0.2
        box: function(id, title, content, position, callback) {
            this.open(id, title, content, position, callback);
        },

        open: function(id, title, content, position, callback) {
            var options = { id: id, title: title, position: position, callback: callback };
            if (content.substr(0, 4) == 'url:') {
                options.type = 'url';
                options.url = content.substr(4);
            } else if (content.substr(0, 4) == 'img:') {
                options.type = 'img';
                options.url = content.substr(4);
            } else if (content.substr(0, 7) == 'iframe:') {
                options.type = 'iframe';
                options.url = content.substr(7);
            } else if (content.substr(0, 9) == 'selector:') {
                options.type = 'selector';
                options.content = content.substr(9);
            } else {
                options.type = 'html';
                options.content = content;
            }

            $._dialog.open(options);
        },

        alert: function(content, title, autoClose) {
            title = title || '系统提示';
            autoClose = autoClose || 30000;
            var id = 'jquery_dialog_tip';
            var options = { id: id, title: title, position: 'c',
                content: content,
                height: 160,
                autoClose: autoClose,
                fnOk: function() { $._dialog.close(id) }
            };
            $._dialog.open(options);
        },

        addSkin: function(key, obj) {
            var skin = $._dialog.skins['default'];
            for (var i in skin) {
                if (typeof obj[i] == 'undefined') {
                    obj[i] = skin[i];
                }
            }
            $._dialog.skins[key] = obj;
        },

        close: function(id) {
            $._dialog.close(id);
        },

        exist: function(id) {
            return $._dialog.list[id];
        },

        setConfig: function(key, value, config) {
            if (!key) return this;
            config = config || 'config';
            if (typeof key == 'string' && value !== null) {
                $._dialog[config][key] = value;
            } else if (typeof key == 'object') {
                $.extend($._dialog[config], key);
            }
            $._dialog.init();
            return this;
        },
        setDefaults: function(key, value) {
            return this.setConfig(key, value, 'defaults');
        }
    });

})(jQuery);


function Register() {
    if (document.getElementById("frame_content") != null) {
        $.dialog.close('regWindow');
    }
    var reg_msg = '<iframe  frameborder="0" id="frame_content" height="510" width="700" src="http://u.qqyy.com/register.aspx"></iframe>';
    $.dialog({
        id: 'regWindow',
        position: 'center',
        align: 'left',
        fixed: 1,
        width: 700,
        height: 510,
        content: reg_msg
    });
    $("#frame_content").attr("src", $("#frame_content").attr("src"));
}

//登录或者注册
function login() {

    if (document.getElementById("frame_content") != null) {
        $.dialog.close('regWindow');
    }
    var reg_msg = '<iframe  frameborder="0" name="frame_content"  id="frame_content" height="367" width="100%" src="http://u.qqyy.com/login.aspx"></iframe>';
    $.dialog({
        id: 'regWindow',
        position: 'center',
        align: 'left',
        fixed: 1,
        width: 702,
        height: 367,
        content: reg_msg
    });
    $("#frame_content").attr("src", $("#frame_content").attr("src"));

}

//登录或者注册
function login2() {

    if (document.getElementById("frame_content") != null) {
        $.dialog.close('regWindow');
    }
    var reg_msg = '<iframe  frameborder="0" id="frame_content" height="420" width="100%" src="http://u.qqyy.com/login2.aspx"></iframe>';
    $.dialog({
        id: 'regWindow',
        position: 'center',
        align: 'left',
        fixed: 1,
        width: 710,
        height: 420,
        content: reg_msg
    });
    $("#frame_content").attr("src", $("#frame_content").attr("src"));
}
//关闭窗体
function closeWindow() {
    $.dialog.close('regWindow');
}

//用户回答问题登录
function LoginAnswer() {
    if (document.getElementById("frame_content") != null) {
        $.dialog.close('regWindow');
    }
    var reg_msg = '<iframe  frameborder="0" id="frame_content" height="330" width="100%" src="http://u.qqyy.com/login1.aspx"></iframe>';
    $.dialog({
        id: 'regWindow',
        position: 'center',
        align: 'left',
        fixed: 1,
        width: 610,
        height: 330,
        content: reg_msg
    });
    $("#frame_content").attr("src", $("#frame_content").attr("src"));
}
//选择医院
function selectHos() {

    if (document.getElementById("frame_content") != null) {
        $.dialog.close('regWindow');
    }
    var reg_msg = '<iframe  frameborder="0" id="frame_content"  width="100%" src="http://u.qqyy.com/hosreg/select_hos.aspx"></iframe>';
    $.dialog({
        id: 'regWindow',
        position: 'center',
        align: 'left',
        fixed: 1,
        width: 657,
        height: 0,
        content: reg_msg
    });
}

$(function () {
    showPageToTop();
    $.getJSON("http://u.qqyy.com/handler/LoginR.ashx?action=new_login&callback=?",
    function (data) {
        $("#div_member").html(data.msg.replace("{regurl}", "http://u.qqyy.com/hosreg/ureg.aspx?url=" + location.href));
        $("#div_member #webMap").hover(function () {
            $(this).nextAll(".m_netList").show();
            $(this).parent().addClass("current");
        }, function () {
            $(this).nextAll(".m_netList").hide();
            $(this).parent().removeClass("current");
        });
        $("#div_member .m_netList").hover(function () { $(this).show(); $(this).parent().addClass("current"); }, function () { $(this).hide(); $(this).parent().removeClass("current"); });

        $("#div_member #headMemberLogin h3").hover(function () {
            $(this).nextAll(".m_login_int").show(); $(this).parent().addClass("current");
        }, function () {
            $(this).nextAll(".m_login_int").hide(); $(this).parent().removeClass("current");
        });

        $("#div_member .m_login_int").hover(function () { $(this).show(); $(this).parent().addClass("current"); }, function () { $(this).hide(); $(this).parent().removeClass("current"); });
        $("#div_member .m_headSech h1").click(function () {
            if ($(this).nextAll(".m_sechBg").is(":hidden")) {
                $(this).nextAll(".m_sechBg").fadeIn();
                $(this).parent().addClass("current");
                $(document).click(function (e) {
                    if (!(e.target == $("#div_member .m_headSech")[0] || $.contains($("#div_member  .m_headSech")[0], e.target))) {
                        $("#div_member .m_headSech .m_sechBg").fadeOut();
                        $(document).unbind("click");
                        $("#div_member .m_headSech .m_sechBg").parent().removeClass("current");
                    }
                });
            }
            else {
                $(this).nextAll(".m_sechBg").fadeOut();
                $(document).unbind("click");
                $(this).parent().removeClass("current");
            }
        });
        $("#div_member .m_headSech .m_sle h3").click(function () {
            if ($("#div_member .m_headSech .m_sle ul").is(":hidden")) {
                $("#div_member .m_headSech .m_sle ul").fadeIn();
            } else {
                $("#div_member .m_headSech .m_sle ul").fadeOut();
            }
        });
        $("#div_member .m_headSech .m_sle").hover(function () { }, function () {
            $("#div_member .m_headSech .m_sle ul").fadeOut();
        });

    });


});




//设置头部搜索---选择搜索类型
function HeaderSetSelType(urlStr, valStr) {
    $("#div_member .m_headSech .m_sle h3").html(valStr + "<span></span>");
    $("#hiHeaderSelTypeUrl").val(urlStr);
    $("#hiHeaderSelTypeText").val(valStr);
    $("#div_member .m_headSech .m_sle ul").fadeOut();
}
//搜索查询链接设置--函数
function HeaderOptionChange_so() {
    var action_so = $("#hiHeaderSelTypeUrl").val();
    var words_so = escape($("#txtHeaderSearchKey").val());
    if (words_so == "请输入关键词") {
        alert("请输入关键词！");
        return false;
    }
    if (action_so == "http://so.qqyy.com/drug?") {
        action_so += "S=_" + words_so + "___";
    } else if (action_so == "http://so.qqyy.com/qx?") {
        action_so += "S=_" + words_so + "_0__0";
    } else if (action_so == "http://so.qqyy.com/company?") {
        action_so += "S=_0_" + words_so;
    } else {
        action_so += "wd=" + words_so;
    }
    document.getElementById("HeaderSoForm").action = action_so;
    return true;
}
function GoToTop() {
    $('html, body').animate({
        scrollTop: 0
    },
        700)
}
function CloseRightFloat() {
    $(".rightfloat_erweima").hide();
    $("#RightFloat .close").hide();
}
//登录按钮
function GoToLogin() {
    var urlpath = location.href;
    location.href =("http://u.qqyy.com/ulogin.aspx?url="+encodeURI(urlpath));
}
function GoToReg() {
    location.href = "http://u.qqyy.com/hosreg/ureg.aspx";
}

//超一屏时，显示“返回顶部”按钮
function showPageToTop() {
    var ScrolltoTop = $("#rightToTop");
    $(ScrolltoTop).hide();
    $(window).scroll(function () {
        if ($(window).scrollTop() == "0") {
            ScrolltoTop.fadeOut("slow");
        } else if ($(window).scrollTop() > "768") {
            ScrolltoTop.fadeIn("slow");
        }
    });
    $(ScrolltoTop).click(function () {
        $('html, body').animate({
            scrollTop: 0
        },
        700)
    });
}




function GetMessage(pindex, pcnt) {
    $("#person_xx").hide();
    $.getJSON("http://u.qqyy.com/handler/LoginR.ashx?action=msgList&pageindex="+pindex+"&cnt="+pcnt+"&callback=?",
    function(data) {
        if (data.msg == "") {
            $("#person_xx").hide();
            MessageColse();
        } else {
            $("#person_xx").html(data.msg);
            $("#person_xx").show();
        }
    });
}
function MessageColse() {$("#person_xx").hide();
    $.getJSON("http://u.qqyy.com/handler/LoginR.ashx?action=messageClose&callback=?",
    function(data) {
         $("#person_xx").hide();
    });
}

function BinMsg()
{
     $("#person_xx .txt_box a").click(function(){
        var id=$("#txtmsgid").val();
        $.getJSON("http://u.qqyy.com/handler/LoginR.ashx?action=messageRead&id="+id+"&callback=?",
    function(data) {
         
    });
   
    })
     $("#person_xx .img_box a").click(function(){
        var id=$("#txtmsgid").val();
        $.getJSON("http://u.qqyy.com/handler/LoginR.ashx?action=messageRead&id="+id+"&callback=?",
    function(data) {
         
    })});
}


function ToLogin()
{
    $(".right_head #header_right_loginbtn").hide();
    $(".right_head .header_btn2").css("display","inline-block");
    var username=$("#txtheaduser").val();
    var pwd=$("#txtheadpwd").val();
    if(username==""||username=="请输入用户名")
    {
        $("#user_error").show();
        $("#pwd_error").hide();
        $("#user_error p").html("请输入用户名！");
        $(".right_head #header_right_loginbtn").css("display","inline-block");
        $(".right_head .header_btn2").hide();
        return;
    }
    else
    {
        $("#user_error").hide();
        $("#pwd_error").hide();
    }
    if(pwd==""||pwd=="请输入密码")
    {
        $("#pwd_error").show();
        $("#user_error").hide();
        $("#pwd_error p").html("请输入密码！");
        $(".right_head #header_right_loginbtn").css("display","inline-block");
        $(".right_head .header_btn2").hide();
        return;
    }
    else
    {
        $("#user_error").hide();
        $("#pwd_error").hide();
    }
$.getJSON("http://u.qqyy.com/handler/LoginR.ashx?action=headlogin&un="+username+"&p="+pwd+"&callback=?",
    function(data) {
        if(data.msg=="1")
        {
            location.href=location.href;
        }
        else
        {
            if(data.msg=="-1")
            {
                $("#user_error").hide();
                $("#pwd_error").show();
                $("#pwd_error p").html("密码错误！");
                setTimeout('$("#pwd_error").hide()', 2000)
            }
            else if(data.msg=="-2")
            {
                $("#user_error").show();
                $("#pwd_error").hide();
                $("#user_error p").html("用户名不存在！");
                setTimeout('$("#user_error").hide()', 2000)
            }
            $(".right_head #header_right_loginbtn").css("display","inline-block");
            $(".right_head .header_btn2").hide();
        }
    });
    
}
function head_close()
{
    $("#head_yd_img").hide();
    $.getJSON("http://u.qqyy.com/handler/LoginR.ashx?action=closehead&callback=?",
    function(data) {
        
    });
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