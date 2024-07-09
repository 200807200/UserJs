/* eslint-env browser */
// ==UserScript==
// @name        onerror
// @description onerror
// @include     *
// @version     1.0.8
// @created     2020-12-13 14:09:27
// @modified    2022-03-26 20:15:40
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://kgithub.com/dodying/UserJs/raw/master/Logo.png
// @run-at      document-end
// @grant       none
// @noframes
// ==/UserScript==
/* global  */
/* eslint-disable no-debugger  */
(function () {
  // 来自 https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onerror#注意事项
  window.onerror = function (msg, url, lineNo, columnNo, error) {
    const string = msg.toLowerCase();
    const substring = 'script error';
    if (string.indexOf(substring) > -1) {
      window.alert('Script Error: See Browser Console for Detail');
    } else {
      const message = [
        `Message: ${msg}`,
        `URL: ${url}`,
        `Line: ${lineNo}`,
        `Column: ${columnNo}`,
        `Error object: ${JSON.stringify(error)}`,
      ].join(' - ');

      window.alert(message);
    }

    return false;
  };
}());
