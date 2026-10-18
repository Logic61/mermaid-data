/* ==========================================================================
   鲛人研究数据库 · 应用外壳（路由 / 导航 / 全局状态）
   依赖：js/core.js，各页面脚本已在 index.html 中优先加载并完成 JR.page 注册。
   ========================================================================== */
(function (global) {
  'use strict';

  var JR = global.JR;
  var doc = global.document;

  var ROUTES = [
    { re: /^$/, id: 'home' },
    { re: /^db$/, id: 'db' },
    { re: /^entry\/([^/]+)$/, id: 'entry', args: ['id'] },
    { re: /^compare$/, id: 'compare' },
    { re: /^timeline$/, id: 'timeline' },
    { re: /^terms$/, id: 'terms' },
    { re: /^about$/, id: 'about' }
  ];

  var NOT_FOUND = {
    title: '页面不存在',
    render: function () {
      return '<section class="wrap section section--page">' +
        '<p class="kicker">404</p>' +
        '<h1 class="display">这一页不在档案里</h1>' +
        '<p class="lede">地址可能有误，或该页面已经迁移。可以回到资料库重新检索。</p>' +
        '<p class="mt-6"><a class="btn btn--solid" href="#/db">进入资料库' + JR.icon('arrow') + '</a> ' +
        '<a class="btn btn--ghost" href="#/">回到首页</a></p>' +
        '</section>';
    }
  };

  function matchRoute(path) {
    for (var i = 0; i < ROUTES.length; i++) {
      var m = ROUTES[i].re.exec(path);
      if (m) {
        var params = {};
        (ROUTES[i].args || []).forEach(function (key, idx) { params[key] = decodeURIComponent(m[idx + 1] || ''); });
        return { id: ROUTES[i].id, args: params };
      }
    }
    return { id: '__404', args: {} };
  }

  function updateNav(routeId) {
    var active = routeId === 'entry' ? 'db' : routeId;
    document.querySelectorAll('[data-nav]').forEach(function (link) {
      var isOn = link.getAttribute('data-nav') === active;
      link.classList.toggle('is-active', isOn);
      if (isOn) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function updateCompareCount() {
    var count = JR.compare.get().length;
    document.querySelectorAll('[data-compare-count]').forEach(function (el) {
      el.textContent = String(count);
      el.hidden = count === 0;
    });
    document.querySelectorAll('[data-compare-link]').forEach(function (el) {
      el.setAttribute('aria-label', '并置比较' + (count ? '，已选 ' + count + ' 条' : ''));
    });
  }

  function setTitle(title) {
    document.title = (title ? title + ' · ' : '') + '从鲛人到美人鱼 · 跨文化形象研究数据库';
  }

  function renderError(err) {
    var view = doc.getElementById('view');
    view.innerHTML = '<section class="wrap section section--page errorbox">' +
      '<p class="kicker">渲染错误</p>' +
      '<h1 class="display display--sm">页面未能完成渲染</h1>' +
      '<p class="lede">可以刷新页面，或回到 <a class="link" href="#/db">资料库</a>。技术细节见浏览器控制台。</p>' +
      '<pre class="errorbox__pre">' + JR.esc(err && (err.stack || err.message) || String(err)) + '</pre>' +
      '</section>';
  }

  var lastRouteKey = null;

  function route() {
    var parsed = JR.parseHash(global.location.hash);
    var hit = matchRoute(parsed.path);
    var page = hit.id === '__404' ? NOT_FOUND : JR.pages[hit.id];
    var view = doc.getElementById('view');

    if (!page) {
      page = {
        title: '尚未加载',
        render: function () {
          return '<section class="wrap section section--page">' +
            '<p class="kicker">页面未注册</p>' +
            '<h1 class="display display--sm">「' + JR.esc(hit.id) + '」页面脚本没有加载</h1>' +
            '<p class="lede">请检查 index.html 中的脚本引用，或回到首页。</p>' +
            '<p><a class="btn btn--ghost" href="#/">回到首页</a></p></section>';
        }
      };
    }

    /* 清理上一页 */
    if (JR.currentPage && typeof JR.currentPage.unmount === 'function') {
      try { JR.currentPage.unmount(); } catch (err) { if (global.console) console.warn(err); }
    }
    JR.currentPage = page;

    try {
      var html = page.render(parsed.params, hit.args || {});
      view.innerHTML = html;
      if (typeof page.mount === 'function') page.mount(view, parsed.params, hit.args || {});
    } catch (err) {
      if (global.console) console.error('[JR] 页面渲染失败：', hit.id, err);
      renderError(err);
    }

    setTitle(page.title);
    updateNav(hit.id);
    updateCompareCount();

    var routeKey = hit.id + '|' + JSON.stringify(hit.args) + '|' + JSON.stringify(parsed.params);
    if (lastRouteKey !== null && lastRouteKey !== routeKey) JR.scrollTop();
    lastRouteKey = routeKey;

    /* 关闭移动端导航 */
    var header = doc.querySelector('.site-header');
    if (header) header.classList.remove('nav-open');
    var toggle = doc.querySelector('[data-nav-toggle]');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  function init() {
    if (!JR.entries.length) {
      if (global.console) console.warn('[JR] 没有装入任何条目，请检查 data/entries-*.js 是否加载。');
    }

    /* 导航开关 */
    var toggle = doc.querySelector('[data-nav-toggle]');
    var header = doc.querySelector('.site-header');
    if (toggle && header) {
      toggle.addEventListener('click', function () {
        var open = header.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      doc.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && header.classList.contains('nav-open')) {
          header.classList.remove('nav-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
        }
      });
    }

    global.addEventListener('hashchange', route);
    global.addEventListener('jr:compare', updateCompareCount);
    /* 跨标签页同步比较选择 */
    global.addEventListener('storage', function (e) {
      if (e.key === 'jr-compare-v1') updateCompareCount();
    });

    if (!global.location.hash) {
      try { history.replaceState(null, '', '#/'); }
      catch (err) { /* file:// 环境下忽略，路由仍按空 hash 处理 */ }
    }
    updateCompareCount();
    route();
  }

  JR.installEntries(global.JR_DATA && global.JR_DATA.entries || []);
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();
})(window);
