/* eslint-env browser */
// ==UserScript==
// @name        [HV]Trainer
// @author      dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://kgithub.com/dodying/UserJs/raw/master/Logo.png
// @include     http*://hentaiverse.org/*
// @include     http://alt.hentaiverse.org/*
// @version     1.03b
// @grant       GM_registerMenuCommand
// @run-at      document-end
// ==/UserScript==
(function () {
  if (!gE('#navbar')) return;
  const countdownBox = gE('body').appendChild(cE('a'));
  countdownBox.href = '?s=Character&ss=tr';
  countdownBox.style.cssText = 'font-weight:bold;font-size:large;position:absolute;top:2px;right:2px';
  let timeLast;
  const trainList = {
    'Adept Learner': {
      id: 50,
      time: 1,
    },
    Assimilator: {
      id: '51',
      time: 24,
    },
    'Ability Boost': {
      id: '80',
      time: 2,
    },
    'Manifest Destiny': {
      id: '81',
      time: 24,
    },
    Scavenger: {
      id: '70',
      time: 4,
    },
    'Luck of the Draw': {
      id: '71',
      time: 8,
    },
    Quartermaster: {
      id: '72',
      time: 12,
    },
    Archaeologist: {
      id: '', //
      time: 24,
    },
    Metabolism: {
      id: '84',
      time: 24,
    },
    Inspiration: {
      id: '85',
      time: 24,
    },
    'Scholar of War': {
      id: '90',
      time: 0,
    },
    Tincture: {
      id: '91',
      time: 0,
    },
    'Pack Rat': {
      id: '98',
      time: 0,
    },
    Dissociation: {
      id: '88',
      time: 24,
    },
    'Set Collector': {
      id: '96',
      time: 12,
    },
  };
  const trainList2 = {
    50: 1,
    51: 24,
    70: 4,
    71: 8,
    72: 12,
    80: 2,
    81: 24,
    84: 24,
    85: 24,
    88: 24,
    90: 0,
    91: 0,
    96: 12,
    98: 0,
    '': 24,
  };
  const lang = navigator.language;
  const timeOption = { hour12: false };
  GM_registerMenuCommand('Train List', () => {
    let time = countdownBox.value || new Date().getTime();
    let trainTask;
    const trainWindow = window.open('', 'trainWindow', 'resizable,scrollbars,width=550,height=250');
    const doc = trainWindow.document;
    const style = gE('head', doc).appendChild(cE('style'));
    style.textContent = '*{margin:5px;text-align:center;}table{border:2px solid #000;border-collapse:collapse;margin:0 auto;}table>tbody>tr>td{border:1px solid #000;}input{text-align:right;width:60px;}';
    const table = gE('body', doc).appendChild(cE('table'));
    const tbody = table.appendChild(cE('tbody'));
    let tr = tbody.appendChild(cE('tr'));
    tr.innerHTML = '<td></td><td>Project</td><td>Freq</td><td>Start Time - End Time</td>';
    const select = [
      '<select>',
      '<option value="-1"></option>',
      '<option value="50">Adept Learner</option>',
      '<option value="51">Assimilator</option>',
      '<option value="80">Ability Boost</option>',
      '<option value="81">Manifest Destiny</option>',
      '<option value="70">Scavenger</option>',
      '<option value="71">Luck of the Draw</option>',
      '<option value="72">Quartermaster</option>',
      '<option value="">Archaeologist</option>',
      '<option value="84">Metabolism</option>',
      '<option value="85">Inspiration</option>',
      '<option value="90">Scholar of War</option>',
      '<option value="91">Tincture</option>',
      '<option value="98">Pack Rat</option>',
      '<option value="88">Dissociation</option>',
      '<option value="96">Set Collector</option>',
      '</select>',
    ].join('');
    let order = 1;
    let i; let _time; let _select; let
      _input;
    const buttonNew = gE('body', doc).appendChild(cE('button'));
    buttonNew.textContent = 'New Task';
    buttonNew.onclick = function () {
      tr = tbody.appendChild(cE('tr'));
      tr.innerHTML = `<td>${order++}</td><td>${select}</td><td><input type="number" value="1" placeholder="1" min="1"></td><td></td>`;
      gE('select', tr).value = '-1';
    };
    const buttonSave = gE('body', doc).appendChild(cE('button'));
    buttonSave.textContent = 'Save Task';
    buttonSave.onclick = function () {
      const input = gE('select,input', 'all', tbody);
      trainTask = [];
      for (i = 0; i < input.length; i = i + 2) {
        if (input[i].value !== '-1') {
          trainTask.push({
            id: input[i].value,
            freq: (input[i + 1].value || input[i + 1].placeholder) * 1,
          });
        }
      }
      setValue('trainTask', trainTask);
      trainWindow.close();
      window.location.href = window.location.href;
    };
    if (getValue('trainTask') && getValue('trainTask') !== '[]') {
      trainTask = getValue('trainTask', true);
      for (i = 0; i < trainTask.length; i++) {
        tr = tbody.appendChild(cE('tr'));
        tr.innerHTML = `<td>${order++}</td><td>${select}</td><td><input type="number" value="${trainTask[i].freq}" placeholder="1" min="1"></td><td></td>`;
        gE('select', tr).value = trainTask[i].id;
      }
      timeChange();
    } else {
      buttonNew.click();
    }
    tbody.onclick = changeEvent;
    tbody.onkeyup = changeEvent;

    function timeChange() {
      _time = gE('tr>td:nth-child(4)', 'all', tbody);
      _select = gE('select', 'all', tbody);
      _input = gE('input', 'all', tbody);
      for (i = 0; i < _select.length; i++) {
        _time[i + 1].textContent = _select[i].value === '-1' ? '' : timeStr(_input[i].value * 1 * trainList2[_select[i].value]);
      }
    }

    function timeStr(hour) {
      const start = time;
      time = start + hour * 60 * 60 * 1000;
      return `${new Date(start).toLocaleString(lang, timeOption)} - ${new Date(time).toLocaleString(lang, timeOption)}`;
    }

    function changeEvent(e) {
      if (e.target.tagName !== 'SELECT' && e.target.tagName !== 'INPUT') return;
      time = countdownBox.value || new Date().getTime();
      timeChange();
    }
  }, 'T');
  post('?s=Character&ss=tr', (data) => {
    if (gE('#train_progcnt', data)) {
      const nowTraining = gE('#train_progress>div>strong', data).innerText;
      const nowTrainingProcess = gE('#train_progcnt', data).innerText;
      const timeAll = trainList[nowTraining].time;
      timeLast = parseInt(timeAll * (1 - 0.01 * nowTrainingProcess) * 60 * 60);
      const timeEnd = new Date(new Date().getTime() + timeLast * 1000);
      countdownBox.title = `Now Train: ${nowTraining}\nTrain End: ${timeEnd.toLocaleString(lang, timeOption)}`;
      countdownBox.value = timeEnd.getTime();
      timeUpdate();
    } else {
      if (getValue('trainTask') && getValue('trainTask') !== '[]') {
        const trainTask = getValue('trainTask', true);
        if (trainTask[0].freq <= 0) trainTask.splice(0, 1);
        if (trainTask.length > 0) {
          trainTask[0].freq--;
          post('?s=Character&ss=tr', () => {
            window.location.href = window.location.href;
          }, `start_train=${trainTask[0].id}`);
        }
        setValue('trainTask', trainTask);
      }
      countdownBox.innerHTML = 'Train Completed';
      document.title = 'Train Completed';
    }
  });

  function timeUpdate() {
    let h; let m; let
      s;
    setInterval(() => {
      timeLast--;
      if (timeLast <= 0) {
        window.location.href = window.location.href;
      } else {
        s = Math.floor(timeLast % 60);
        if (s < 10) s = `0${s.toString()}`;
        m = Math.floor((timeLast / 60) % 60);
        if (m < 10) m = `0${m.toString()}`;
        h = Math.floor((timeLast / 3600) % 24);
        if (h < 10) h = `0${h.toString()}`;
        countdownBox.innerText = `${h}:${m}:${s}`;
      }
    }, 1000);
    setTimeout(() => {
      window.location.href = window.location.href;
    }, 1000 * 60 * 10);
  }
}());

function setValue(item, value) {
  window.localStorage[item] = (typeof value === 'string') ? value : JSON.stringify(value);
}

function getValue(item, toJSON) {
  return (window.localStorage[item]) ? ((toJSON) ? JSON.parse(window.localStorage[item]) : window.localStorage[item]) : null;
}

function gE(ele, mode, parent) { // 获取元素
  if (typeof ele === 'object') {
    return ele;
  } if (mode === undefined && parent === undefined) {
    return (isNaN(ele * 1)) ? document.querySelector(ele) : document.getElementById(ele);
  } if (mode === 'all') {
    return (parent === undefined) ? document.querySelectorAll(ele) : parent.querySelectorAll(ele);
  } if (typeof mode === 'object' && parent === undefined) {
    return mode.querySelector(ele);
  }
}

function cE(name) { // 创建元素
  return document.createElement(name);
}

function post(href, func, parm) { // post
  let xhr = new window.XMLHttpRequest();
  xhr.open(parm ? 'POST' : 'GET', href);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  xhr.responseType = 'document';
  xhr.onerror = function () {
    xhr = null;
    post(href, func, parm);
  };
  xhr.onload = function (e) {
    if (e.target.status >= 200 && e.target.status < 400 && typeof func === 'function') {
      const data = e.target.response;
      if (xhr.responseType === 'document' && gE('#messagebox', data)) {
        if (gE('#messagebox')) {
          gE('#csp').replaceChild(gE('#messagebox', data), gE('#messagebox'));
        } else {
          gE('#csp').appendChild(gE('#messagebox', data));
        }
      }
      func(data, e);
    }
    xhr = null;
  };
  xhr.send(parm);
}
