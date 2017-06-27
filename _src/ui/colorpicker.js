///import core
///import uicore
(function (){
    var store = window.store;
    var _id = new Date().getTime().toString(32);
    var utils = baidu.editor.utils,
        UIBase = baidu.editor.ui.UIBase,
        ColorPicker = baidu.editor.ui.ColorPicker = function (options){
            this.initOptions(options);
            this.noColorText = this.noColorText || this.editor.getLang("clearColor");
            this.initUIBase();
        };

    function addlog(color) {
        var newlyColor = store.get('newlyColor');
        if(!newlyColor || newlyColor === null) {
            newlyColor = []
        }else{
            newlyColor = newlyColor.split(',')
        }
        if(newlyColor.indexOf(color) > -1) {
            return ;
        }
        newlyColor.unshift(color);
        newlyColor = newlyColor.slice(0, 9);
        store.set("newlyColor", newlyColor.join(','));
        var newlyColorHtml = genNewlyColor(newlyColor);
        document.getElementById('newlyColor' + _id).innerHTML = newlyColorHtml;
    }
    addlog = addlog.bind(this);
    ColorPicker.prototype = {
        addlog: function(color) {
            var newlyColor = store.get('newlyColor');
            if(!newlyColor || newlyColor === null) {
                newlyColor = []
            }else{
                newlyColor = newlyColor.split(',')
            }
            if(newlyColor.indexOf(color) > -1) {
                return ;
            }
            newlyColor.unshift(color);
            newlyColor = newlyColor.slice(0, 9);
            store.set("newlyColor", newlyColor.join(','));
            var newlyColorHtml = genNewlyColor(newlyColor);
            document.getElementById('newlyColor' + _id).innerHTML = newlyColorHtml;
        },
        getHtmlTpl: function (){
            return genColorPicker(this.noColorText,this.editor);
        },
        _onChange: function(evt) {
            var tgt = evt.target || evt.srcElement;
            var color = tgt.value;
            if (color) {
                this.getDom('value').value = color.slice(1);
                this.getDom('preview').style.backgroundColor = color;
            }
        },
        _onTableClick: function (evt){
            var tgt = evt.target || evt.srcElement;
            var color = tgt.getAttribute('data-color');
            if (color) {
                this.addlog(color);
                this.getDom('value').value = color.slice(1);
                this.fireEvent('pickcolor', color);
            }
        },
        _onTableOver: function (evt){
            var tgt = evt.target || evt.srcElement;
            var color = tgt.getAttribute('data-color');
            if (color) {
                this.getDom('value').value = color.slice(1);
                this.getDom('preview').style.backgroundColor = color;
            }
        },
        _onTableOut: function (){
            this.getDom('preview').style.backgroundColor = '';
        },
        _onPickNoColor: function (){
            this.fireEvent('picknocolor');
        },
        _onEnterColor: function(){
            var color = '#' + this.getDom('value').value;
            this.addlog(color);
            this.fireEvent('pickcolor', color);
        }
    };
    utils.inherits(ColorPicker, UIBase);

    var COLORS = (
        'ffffff,ffd7d5,ffdaa9,fffed5,d4fa00,73fcd6,a5c8ff,ffacd5,ff7faa,d6d6d6,' +
        'ffacaa,ffb995,fffb00,73fa79,00fcff,78acfe,d84fa9,ff4f79,b2b2b2,d7aba9,' +
        'ff6827,ffda51,00d100,00d5ff,0080ff,ac39ff,ff2941,888888,7a4442,ff4c00,' +
        'ffa900,3da742,3daad6,0052ff,7a4fd6,d92142,000000,7b0c00,ff4c41,d6a841,' +
        '407600,007aaa,021eaa,7a00ff,ab1942,').split(',');
            // 'c00000,ff0000,ffc000,ffff00,92d050,00b050,00b0f0,0070c0,002060,7030a0,').split(',');

    function genNewlyColor(newlyColor, noColorText, editor){
        if(!newlyColor) {
            newlyColor = store.get("newlyColor");
            if(newlyColor) {
                newlyColor = newlyColor.split(',');
            }else {
                newlyColor = []
            }
        }
        var html = '';
        for(var i = 0; i < 8; i ++) {
            if(!newlyColor[i]) {
                html += '<span><i style="background-color:#FFF"></i></span>';
                continue;
            }
            html += '<span><i data-color="'+ newlyColor[i] + '" style="background-color:'+ newlyColor[i] +';' + '"></i></span>'
        }
        return html;
    }
    function genColorPicker(noColorText, editor) {

        var html = '<div id="##" class="edui-colorpicker %%">' +
                        '<div class="edui-colorpicker-topbar edui-clearfix">' +
                            '<div unselectable="on" id="##_preview" class="edui-colorpicker-preview"></div>' +
                            '<div class="edui-colorpicker-value"># <input id="##_value" type="text" value="000000" /></div>' +
                            '<div unselectable="on" class="edui-colorpicker-nocolor" onclick="$$._onEnterColor(event, this);">'+ editor.getLang("enterColor") +'</div>' +
                        '</div>' +
                    '<div class="edui-colorpicker-box"><div class="edui-colorpicker-title">' + editor.getLang("newlyColor") + '<div></div>' +
                    '<div class="edui-colorpicker-item" onmouseover="$$._onTableOver(event, this);" onmouseout="$$._onTableOut(event, this);" onclick="return $$._onTableClick(event, this);">';
        html += '<span><i class="undefined-color" onclick="return $$._onPickNoColor(event, this);"></i></span>';
        html += '<div id="newlyColor' + _id + '" class="edui-colorpicker-innerBox">' + genNewlyColor() + '</div>';

        html +=         '</div><div class="edui-colorpicker-title">' +
                            '<span>' + editor.getLang("themeColor") + '</span> | ' +
                            '<span><label for="colorpickerInput' + _id + '">' + editor.getLang("moreColor") + '</label><input value="#FFFFFF" style="opacity: 0;width: 0px;height: 0px;" id="colorpickerInput' + _id + '" type="color" onchange="$$._onChange(event, this)"></span>' +
                        '</div>' +
                        '<div class="edui-colorpicker-item"onmouseover="$$._onTableOver(event, this);" onmouseout="$$._onTableOut(event, this);" onclick="return $$._onTableClick(event, this);">';
        for(var i = 0; i < COLORS.length; i ++) {
            if(!COLORS[i]) {
                continue;
            }
            html += '<span><i data-color="#'+ COLORS[i] + '" style="background-color:#'+ COLORS[i] +';' + '"></i></span>'
        }
        html +=     '</div></div></div>';
        return html;
    }
})();
