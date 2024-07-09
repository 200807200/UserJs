/* eslint-env browser */
// ==UserScript==
// @name        []copyTable
// @description copyTable
// @include     *
// @version     1.0.6
// @modified    2022-03-26 20:15:47
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://kgithub.com/dodying/UserJs/raw/master/Logo.png
// @run-at      document-end
// @grant       GM_setClipboard
// require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js
// ==/UserScript==
/* eslint-disable no-debugger  */
(function () {
  const tagName = ['HTML', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD'];

  window.addEventListener('keyup', (e) => {
    if (e.key === 'c' && e.ctrlKey) {
      let node = window.getSelection().anchorNode || window.getSelection().focusNode;
      if (!node) return;
      while (true) {
        if (tagName.includes(node.tagName)) break;
        node = node.parentNode;
      }
      if (node.tagName === 'HTML') return;
      // console.log(node)

      let tableNode = node;
      while (true) {
        if (tableNode.tagName === 'TABLE') break;
        tableNode = tableNode.parentNode;
      }
      // console.log(tableNode)

      const xs = tableNode.querySelectorAll('tr');
      const table = new Array(xs.length);
      const tableTxt = new Array(xs.length);

      for (let x = 0; x < xs.length; x++) { // 生成二维数组
        tableTxt[x] = [];
        table[x] = [];
      }

      for (let x = 0; x < xs.length; x++) {
        const ys = xs[x].querySelectorAll('th,td');
        for (let y = 0; y < ys.length; y++) {
          const ele = ys[y];
          const txt = ele.textContent.trim();

          let yT = y;
          while (tableTxt[x][yT]) {
            yT = yT + 1;
          }
          table[x][yT] = ele;
          tableTxt[x][yT] = txt;

          let col = ele.getAttribute('colspan') * 1;
          let row = ele.getAttribute('rowspan') * 1;

          if (col || row) {
            col = col || 1;
            row = row || 1;
            for (let x1 = 0; x1 < row; x1++) {
              for (let y1 = 0; y1 < col; y1++) {
                table[x + x1][yT + y1] = ele;
                tableTxt[x + x1][yT + y1] = txt;
              }
            }
          }
        }
      }

      // console.log({ table, tableTxt })

      const toCopy = [];

      if (['TH', 'TD'].includes(node.tagName)) {
        const has = table.filter((i) => i.includes(node))[0];
        const x = table.indexOf(has);
        const y = has.indexOf(node);
        // console.log(x, y, node, table[x][y], node === table[x][y])
        toCopy.push({
          name: '单元格',
          txt: tableTxt[x][y],
        });

        toCopy.push({
          name: '列',
          txt: tableTxt.map((i) => i[y]).join('\n'),
        });

        node = node.parentNode;
      }

      if (['TR'].includes(node.tagName)) {
        const has = table.filter((i) => i.includes(node.children[0]))[0];
        const x = table.indexOf(has);
        // console.log(x, node, table[x])
        toCopy.push({
          name: '行',
          txt: tableTxt[x].join('\t'),
        });

        node = node.parentNode;
      }

      toCopy.push({
        name: '表',
        txt: tableTxt.map((i) => i.join('\t')).join('\n'),
      });

      // console.log(toCopy)
      const prompt = window.prompt(toCopy.map((i, j) => `${j + 1}:  ${i.name}`).join('\n'));
      if (prompt) GM_setClipboard(toCopy[prompt - 1].txt);
    }
  });
}());
