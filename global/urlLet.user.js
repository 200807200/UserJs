/* eslint-env browser */
// ==UserScript==
// @name        []urlLet
// @description urlLet
// @include     *
// @version     1.0.133
// @created     2020-10-13 10:44:15
// @modified    2022-03-26 20:15:36
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://kgithub.com/dodying/UserJs/raw/master/Logo.png
// @run-at      document-end
// @grant       GM_registerMenuCommand
// @grant       GM_getResourceText
// @noframes
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js
// ==/UserScript==
/* eslint-disable no-debugger  */
/* global $ */
/* global GM_registerMenuCommand */
(function () {
  let script = window.location.hash.match(/#javascript:(.*)$/);
  if (script) {
    script = decodeURI(script[1]);
    new Function(script)(); // eslint-disable-line no-new-func
    window.history.pushState(null, null, window.location.href.replace(/#javascript:(.*)$/, ''));
  }

  $('<style>').text([
    '.urlLetContainer{width:98vw;height:98vh;position:fixed;top:0;left:0;}',
    '.urlLetContainer>a{background:#fff;font:18px/25px \'Droid Sans Mono\',sans-serif;}',
    '.urlLetContainer>textarea{position:absolute;left:25%;top:8%;width:50%;height:80%;padding:20px;font:18px/25px \'Droid Sans Mono\',sans-serif;}',
  ].join('')).appendTo('head');
  GM_registerMenuCommand('set urlLet', () => {
    const urlLetContainer = $('<div class="urlLetContainer">').on('click', (e) => {
      if (e.target === urlLetContainer.get(0)) $(urlLetContainer).remove();
    }).appendTo('body');
    const link = $('<a target="_blank" href="#">').text(document.title).appendTo(urlLetContainer);
    const textarea = $('<textarea>').text(script).on('keyup', (e) => {
      script = textarea.val().trim();
      const url = `${window.location.href.replace(/#javascript:(.*)$/, '')}#javascript:${encodeURI(script)}`;
      $(link).attr('href', url);
    }).appendTo(urlLetContainer);
  });
}());
