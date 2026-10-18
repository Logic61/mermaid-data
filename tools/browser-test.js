/* ==========================================================================
   浏览器交互冒烟测试（供 tools/browser-test.html 使用，仅测试用，不进入站点）
   结果写入 #bt-out 的 BT_RESULT_BEGIN/END 之间，供 Chrome --dump-dom 解析。
   ========================================================================== */
(function () {
  'use strict';

  var results = [];
  var failures = 0;

  function check(name, cond, detail) {
    results.push({ name: name, ok: !!cond, detail: detail || '' });
    if (!cond) failures += 1;
  }
  function q(sel, root) { return (root || document).querySelector(sel); }
  function qa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function text(el) { return el ? (el.textContent || '').trim() : ''; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function overflowReport() {
    var offenders = [];
    var nodes = document.querySelectorAll('#view *');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var r = el.getBoundingClientRect();
      if (r.width > 0 && r.right > window.innerWidth + 2) {
        var cls = typeof el.className === 'string' ? el.className.split(' ')[0] : '';
        offenders.push(el.tagName.toLowerCase() + (cls ? '.' + cls : '') + '@' + Math.round(r.right));
      }
    }
    return offenders.slice(0, 8).join(', ');
  }

  function pageState(label) {
    var view = q('#view');
    check(label + '：无渲染错误框', !!view && !view.querySelector('.errorbox'));
    var h1 = q('h1', view);
    check(label + '：有且仅有一个标题', qa('h1', view).length === 1 && !!text(h1), text(h1));
    var overflow = document.documentElement.scrollWidth - window.innerWidth;
    var diag = '';
    var scrollBox = q('.cmp-scroll', view);
    if (overflow > 2 && scrollBox) {
      var sr = scrollBox.getBoundingClientRect();
      var wr = q('.cmp-page', view).getBoundingClientRect();
      diag = ' cmp-scroll.width=' + Math.round(sr.width) + ' cmp-page.width=' + Math.round(wr.width) +
        ' overflowX=' + getComputedStyle(scrollBox).overflowX + ' clientW=' + scrollBox.clientWidth;
    }
    check(label + '：无横向溢出', overflow <= 2, 'overflow=' + overflow + 'px;' + diag + ' ' + overflowReport());
    check(label + '：页面有内容', (view.innerHTML || '').length > 800, String((view.innerHTML || '').length));
    return view;
  }

  async function run() {
    await wait(260); // 等待 app.js 初始化完成
    var JR = window.JR;
    var ids = JR.entries.map(function (e) { return e.id; });
    check('数据已装载', ids.length >= 60, 'entries=' + ids.length);

    /* ---------------- 首页 ---------------- */
    location.hash = '#/';
    await wait(240);
    var view = pageState('首页');
    var cta = q('.hero__cta .btn', view);
    check('首页：存在主按钮', !!cta);
    if (window.innerWidth >= 1024) {
      check('首页：主按钮在首屏内', !!cta && cta.getBoundingClientRect().bottom <= window.innerHeight + 1,
        cta ? Math.round(cta.getBoundingClientRect().bottom) + 'px / viewport ' + window.innerHeight + 'px' : 'no cta');
    }
    if (window.innerWidth >= 1024) {
      var tops = {};
      qa('.site-nav a').forEach(function (a) { tops[Math.round(a.getBoundingClientRect().top)] = 1; });
      check('导航：桌面端单行显示', Object.keys(tops).length <= 1, 'tops=' + Object.keys(tops).join(','));
    }
    check('首页：有精选条目链接', qa('a[href^="#/entry/"]', view).length >= 4, 'links=' + qa('a[href^="#/entry/"]', view).length);

    /* ---------------- 资料库 ---------------- */
    location.hash = '#/db';
    await wait(260);
    view = pageState('资料库');
    var total = JR.entries.length;
    var countText = text(q('[data-db-count]', view));
    check('资料库：计数显示全部条目', countText.indexOf(String(total)) >= 0, countText);
    var chip = q('[data-facet="kind"][data-value="ancient"]', view);
    check('资料库：存在类型筛选片', !!chip);
    if (chip) {
      chip.click();
      await wait(280);
      check('资料库：类型筛选写入 URL', location.hash.indexOf('kind=ancient') >= 0, location.hash);
      var rows = qa('.db-row', view).length;
      check('资料库：筛选后结果减少', rows > 0 && rows < total, 'rows=' + rows + ' / ' + total);
      check('资料库：筛选后计数为 aria-live 文本', text(q('[data-db-count]', view)).indexOf('结果') >= 0, text(q('[data-db-count]', view)));
      var reset = q('[data-db-reset]', view);
      check('资料库：存在清除筛选按钮', !!reset);
      if (reset) { reset.click(); await wait(280); }
      check('资料库：清除后恢复全部', text(q('[data-db-count]', view)).indexOf(String(total)) >= 0, text(q('[data-db-count]', view)));
    }
    var input = q('[data-db-q]', view);
    check('资料库：存在关键词输入', !!input);
    if (input) {
      input.value = '鲛人';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await wait(560);
      check('资料库：关键词检索写入 URL', location.hash.indexOf('q=') >= 0, location.hash);
      check('资料库：关键词检索有结果', qa('.db-row', view).length > 0, 'rows=' + qa('.db-row', view).length);
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await wait(480);
    }
    try { localStorage.removeItem('jr-compare-v1'); } catch (err) {}
    var cmpToggle = q('[data-compare-toggle]', view);
    check('资料库：存在加入比较按钮', !!cmpToggle);
    if (cmpToggle) {
      cmpToggle.click();
      await wait(220);
      var saved = [];
      try { saved = JSON.parse(localStorage.getItem('jr-compare-v1') || '[]'); } catch (err) {}
      check('资料库：加入比较写入存储', saved.length === 1, JSON.stringify(saved));
      var clear = q('[data-cmp-clear]', view);
      if (clear) { clear.click(); await wait(180); }
      var after = [];
      try { after = JSON.parse(localStorage.getItem('jr-compare-v1') || '[]'); } catch (err) {}
      check('资料库：可清空比较选择', after.length === 0, JSON.stringify(after));
    }
    var drawerBtn = q('[data-db-open]', view);
    if (drawerBtn && drawerBtn.offsetParent !== null) {
      drawerBtn.click();
      await wait(220);
      var side = q('[data-db-side]', view);
      check('资料库：移动端筛选抽屉可打开',
        drawerBtn.getAttribute('aria-expanded') === 'true' && !!side && side.classList.contains('is-open'),
        'expanded=' + drawerBtn.getAttribute('aria-expanded') + ' open=' + (side ? side.classList.contains('is-open') : 'no-side'));
      var closeBtn = q('[data-db-close]', view);
      if (closeBtn) { closeBtn.click(); await wait(180); }
      check('资料库：移动端筛选抽屉可关闭', drawerBtn.getAttribute('aria-expanded') === 'false',
        'expanded=' + drawerBtn.getAttribute('aria-expanded'));
    }

    /* ---------------- 条目详情 ---------------- */
    if (ids.length) {
      location.hash = '#/entry/' + ids[0];
      await wait(260);
      view = pageState('条目详情');
      check('条目详情：显示来源与编码', view.innerHTML.indexOf('出处') >= 0 && view.innerHTML.indexOf('编码') >= 0);
      check('条目详情：存在复制引文按钮', !!q('[data-entry-copy]', view));
      var toggle = q('[data-compare-toggle]', view);
      if (toggle) {
        try { localStorage.removeItem('jr-compare-v1'); } catch (err) {}
        toggle.click();
        await wait(180);
        var chosen = [];
        try { chosen = JSON.parse(localStorage.getItem('jr-compare-v1') || '[]'); } catch (err) {}
        check('条目详情：加入比较可用', chosen.length === 1, JSON.stringify(chosen));
        try { localStorage.removeItem('jr-compare-v1'); } catch (err) {}
      }
    }

    /* ---------------- 并置比较 ---------------- */
    if (ids.length >= 3) {
      location.hash = '#/compare?ids=' + ids.slice(0, 3).join(',');
      await wait(300);
      view = pageState('并置比较');
      check('并置比较：存在比较矩阵', !!q('.cmp-table', view));
      if (window.innerWidth < 760) {
        var docW1 = document.documentElement.scrollWidth;
        var tbl = q('.cmp-table', view);
        var wNoTable = docW1;
        if (tbl) { tbl.style.display = 'none'; wNoTable = document.documentElement.scrollWidth; tbl.style.display = ''; }
        var fixStyle = document.createElement('style');
        fixStyle.textContent = '.cmp-scroll{contain:paint;width:100%;max-width:100%}';
        document.head.appendChild(fixStyle);
        var wFix = document.documentElement.scrollWidth;
        fixStyle.parentNode.removeChild(fixStyle);
        results.push({ name: '诊断：比较矩阵溢出', ok: true, detail: 'docW=' + docW1 + ' noTable=' + wNoTable + ' containPaint=' + wFix + ' viewport=' + window.innerWidth });
      }
      var diff = q('[data-cmp-diff]', view);
      check('并置比较：存在仅显示差异开关', !!diff);
      if (diff) {
        var before = diff.checked;
        diff.click();
        await wait(180);
        var scrollBox = q('.cmp-scroll', view);
        check('并置比较：差异开关可切换',
          diff.checked !== before && !!scrollBox && scrollBox.classList.contains('is-diff-only'),
          'checked=' + diff.checked + ' diffClass=' + (scrollBox ? scrollBox.classList.contains('is-diff-only') : 'no-scroll'));
      }
    }

    /* ---------------- 时间轴 ---------------- */
    location.hash = '#/timeline';
    await wait(300);
    view = pageState('时间轴');
    var marks = qa('[data-entry-id]', view).length;
    check('时间轴：标记数量充足', marks >= 30, 'marks=' + marks);
    var modern = q('[data-tl-scale="modern"]', view);
    check('时间轴：存在尺度切换', !!modern);
    if (modern) {
      modern.click();
      await wait(280);
      check('时间轴：尺度切换写入 URL', location.hash.indexOf('scale=modern') >= 0, location.hash);
      var modernMarks = qa('[data-entry-id]', view).length;
      check('时间轴：近现代标记数减少', modernMarks > 0 && modernMarks < marks, 'modern=' + modernMarks + ' / all=' + marks);
    }
    var listBtn = q('[data-tl-view="list"]', view);
    if (listBtn) {
      listBtn.click();
      await wait(240);
      var listHost = q('[data-tl-list]', view);
      check('时间轴：列表视图可切换',
        listBtn.getAttribute('aria-pressed') === 'true' && !!listHost && !listHost.hidden,
        'pressed=' + listBtn.getAttribute('aria-pressed') + ' hidden=' + (listHost ? listHost.hidden : 'no-host'));
    }

    /* ---------------- 名称谱系 ---------------- */
    location.hash = '#/terms';
    await wait(300);
    view = pageState('名称谱系');
    var nodes = qa('[data-term-id]', view);
    check('名称谱系：名称节点数量', nodes.length >= 8, 'nodes=' + nodes.length);
    if (nodes.length) {
      nodes[0].click();
      await wait(280);
      check('名称谱系：节点筛选写入 URL', location.hash.indexOf('term=') >= 0, location.hash);
      check('名称谱系：节点筛选渲染条目区', !!q('[data-term-entries]', view));
    }

    /* ---------------- 研究说明 ---------------- */
    location.hash = '#/about';
    await wait(260);
    view = pageState('研究说明');
    check('研究说明：含参考书目与编码手册', view.innerHTML.indexOf('参考书目') >= 0 && view.innerHTML.indexOf('编码手册') >= 0);
    check('研究说明：书目条数 >= 20', qa('.bib-item', view).length >= 20, 'bib=' + qa('.bib-item', view).length);

    check('无未捕获脚本错误', window.__errors.length === 0, window.__errors.join(' | ').slice(0, 300));

    var out = {
      failures: failures,
      results: results,
      errors: window.__errors,
      entries: JR.entries.length,
      viewport: [window.innerWidth, window.innerHeight],
      hash: location.hash,
      title: document.title
    };
    q('#bt-out').textContent = 'BT_RESULT_BEGIN' + JSON.stringify(out) + 'BT_RESULT_END';
    document.title = 'BT:' + failures;
  }

  window.addEventListener('load', function () {
    setTimeout(function () {
      run().catch(function (err) {
        var out = { failures: 999, fatal: String((err && err.stack) || err), results: results, errors: window.__errors };
        var pre = document.getElementById('bt-out');
        if (pre) pre.textContent = 'BT_RESULT_BEGIN' + JSON.stringify(out) + 'BT_RESULT_END';
        document.title = 'BT:999';
      });
    }, 260);
  });
})();
