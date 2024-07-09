/* eslint-env browser */
// ==UserScript==
// @name        [H]CopyInfo
// @version     1.01.7
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://github.com/dodying/UserJs/raw/master/Logo.png
// @include     http*://www.javlibrary.com/*
// @include     http*://www.javbus.com/*
// @include     http*://www.caribbeancom.com/moviepages/*
// @include     http*://www.caribbeancompr.com/moviepages/*
// @grant       GM_setClipboard
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js
// @run-at      document-end
// ==/UserScript==
(function () {
  if (window.location.href.match('/search/') && $('.item').length === 1) {
    window.location = $('.item>a').attr('href');
    return;
  } if (window.location.href.match('vl_searchbyid')) {
    const find = $('.id').filter(function () {
      return this.textContent === window.location.href.match(/keyword=(.*?)$/)[1] && !$(this).parents().eq(1).text()
        .match('（ブルーレイディスク）');
    });
    if (find.length === 1) window.location = find.parent().attr('href');
    return;
  }
  const linkLib = {
    'www.javlibrary.com': {
      searchInput: '#idsearchbox',
      searchButton: '#idsearchbutton',
      code: '#video_id .text',
      name: '.post-title',
      star: 'span.star>a',
      genre: '.genre>a',
      score: 'span.score',
      length: '#video_length .text',
    },
    'www.javbus.com': {
      searchInput: '#search-input',
      searchButton: '#navbar .btn[type="submit"]',
      code: '.info>p>span:eq(1)',
      name: 'h3',
      star: '.star-show~p:eq(0)>.genre>a',
      genre: '.header:contains(類別)~p:eq(0)>.genre>a',
      length: '.info>p:eq(2)',
    },
    'www.caribbeancompr.com': {
      searchInput: '#q',
      searchUrl: 'https://www.caribbeancompr.com/moviepages/{{q}}/',
      code: /moviepages\/(.*?)\//,
      name: '.video-detail>h1',
      star: '.movie-info>dl:contains("出演") a',
      genre: '.movie-info-cat>dd>a',
      length() {
        let time = $('.movie-info>dl:contains("再生時間")>dd').text();
        time = new Date(`1970-01-01 ${time} GMT+000`).getTime();
        return Math.round(time / 1000 / 60);
      },
    },
    'www.caribbeancom.com': {
      searchInput: '#q',
      searchUrl: 'https://www.caribbeancom.com/moviepages/{{q}}/',
      code: /moviepages\/(.*?)\//,
      name: '.video-detail>h1',
      star: '.movie-info>dl:contains("出演") a',
      genre: '.movie-info-cat>dd>a',
      length() {
        let time = $('.movie-info>dl:contains("再生時間")>dd').text();
        time = new Date(`1970-01-01 ${time} GMT+000`).getTime();
        return Math.round(time / 1000 / 60);
      },
    },
  };
  const rule = linkLib[window.location.host];
  $(rule.searchInput).on('paste', function () {
    const _ = this;
    setTimeout(() => {
      _.value = _.value.replace(/\..*$/, '');
      if (_.value && rule.searchButton) {
        $(rule.searchButton).click();
      } else if (_.value && rule.searchUrl) {
        window.location.href = rule.searchUrl.replace('{{q}}', _.value);
      }
    }, 20);
  });
  let stars; let genres; let
    info; // total info
  const stars2 = []; // stars
  stars = [];
  genres = [];
  $(rule.star).each(function () {
    stars.push(this.innerText);
    stars2.push(`${this.innerText}\t${this.href}`);
  });
  $(rule.genre).each(function () {
    genres.push(this.innerText);
  });
  info = [
    typeof rule.code === 'string' ? $(rule.code).text().trim() : window.location.href.match(rule.code)[1], // code
    $(rule.name).text().replace(/^(\w+(_|-))?\w+ /, '').replace(/\n/g, '')
      .trim(), // name
    stars.sort().join(' '), // star
    genres.join(' '), // genre
  ];
  if (!info[0]) return;
  if (typeof rule.score === 'string') { // score
    info.push($(rule.score).text() ? $(rule.score).text().match(/[\d.]+/)[0] : '');
  }
  if (typeof rule.length === 'string' && $(rule.length).length > 0) { // length
    info.push($(rule.length).text().match(/\d+/)[0]);
  } else {
    info.push(rule.length());
  }
  document.title = info[0];
  document.onkeydown = function (e) {
    if (e.ctrlKey && e.key === 'c' && window.getSelection().toString() === '') {
      GM_setClipboard(info.join('\t'));
      if ($('.hBanner')) $('.addCode').click();
    } else if (e.ctrlKey && e.key === 'v' && e.target.tagName === 'BODY') {
      $(rule.searchInput).select();
    } else if (e.ctrlKey && e.key === 'x' && window.getSelection().toString() === '') {
      GM_setClipboard(stars2.join('\r\n'));
    }
  };
}());
