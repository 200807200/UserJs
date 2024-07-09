// ==UserScript==
// @name        baiduShareCopy
// @namespace   https://github.com/dodying/Dodying-UserJs
// @name:zh-CN  【百度云】分享页复制
// @description:zh-CN  作者Firefox，常禁用Flash
// @include     http://pan.baidu.com/share/manage
// @version     1.04
// @grant       GM_setClipboard
// @author      dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://github.com/dodying/UserJs/raw/master/Logo.png
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js
// @run-at      document-end
// ==/UserScript==
var interval = setInterval(() => {
  if (jQuery('div.btns:has(a.unshare)').length === 0) {

  } else {
    clearInterval(interval);
    jQuery('div.btns:has(a.unshare)').append('<a class="btn copy"></a>');
    jQuery('head').append('<style>.copy{background-position:-160px -106px !important;cursor:pointer;}.copy:hover{background-position:-183px -106px !important;}</style>');
    jQuery('.copy').click(function () {
      const txt = jQuery(this).parents('.item').find('.copy-bar').text()
        .replace(/\s+/g, ' ')
        .replace('复制', '')
        .replace(/^\s+|\s+$/g, '');
      GM_setClipboard(txt);
    });
  }
}, 200);
